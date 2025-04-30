package com.yourapp

import android.graphics.BitmapFactory
import android.util.Base64
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.core.Delegate
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarkerResult
import org.json.JSONArray
import kotlin.math.acos
import kotlin.math.sqrt

class HandLandmarkerHelperModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  private var handLandmarker: HandLandmarker? = null

  override fun getName(): String = "HandLandmarkerHelper"

  init {
    setupHandLandmarker()
  }

  private fun setupHandLandmarker() {
    val baseOptions = BaseOptions.builder()
      .setDelegate(Delegate.CPU)
      .setModelAssetPath("hand_landmarker.task")
      .build()

    val options = HandLandmarker.HandLandmarkerOptions.builder()
      .setBaseOptions(baseOptions)
      .setRunningMode(RunningMode.LIVE_STREAM)
      .setNumHands(2)
      .setMinHandDetectionConfidence(0.5f)
      .setMinTrackingConfidence(0.5f)
      .setMinHandPresenceConfidence(0.5f)
      .setResultListener(this::onLiveStreamResult)
      .setErrorListener(this::onLiveStreamError)
      .build()

    handLandmarker = HandLandmarker.createFromOptions(reactContext, options)
  }

  @ReactMethod
  fun detectLiveStreamFrame(b64jpeg: String) {
    try {
      val decoded = Base64.decode(b64jpeg, Base64.DEFAULT)
      val bmp = BitmapFactory.decodeByteArray(decoded, 0, decoded.size)
      val mpImage: MPImage = BitmapImageBuilder(bmp).build()
      val timestamp = System.currentTimeMillis()
      handLandmarker?.detectAsync(mpImage, timestamp)
    } catch (e: Exception) {
      sendError(e.localizedMessage)
    }
  }

  private fun onLiveStreamResult(
    result: HandLandmarkerResult,
    input: MPImage
  ) {
    val featuresJson = buildFeaturesJson(result)
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("onHandFeatures", featuresJson)
  }

  private fun onLiveStreamError(error: RuntimeException) {
    sendError(error.message)
  }

  private fun sendError(message: String?) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit("onHandFeaturesError", message ?: "Unknown error")
  }

  private fun buildFeaturesJson(result: HandLandmarkerResult): String {
    val landmarksList = result.multiHandLandmarks()
    val features = JSONArray()
    if (landmarksList.isEmpty()) {
      repeat(100) { features.put(0.0) }
      return features.toString()
    }
    val lm = landmarksList[0]
    // Extract joint coords [21][4]
    val joint = Array(21) { FloatArray(4) }
    for (i in 0 until 21) {
      joint[i][0] = lm.landmark(i).x
      joint[i][1] = lm.landmark(i).y
      joint[i][2] = lm.landmark(i).z
      joint[i][3] = lm.landmark(i).visibility
    }
    // Flatten joints
    for (i in 0 until 21) for (j in 0 until 4) features.put(joint[i][j].toDouble())
    // Compute angles
    val idx1 = intArrayOf(0,1,2,4,5,6,8,9,10,12,13,14,16,17,18)
    val idx2 = intArrayOf(1,2,3,5,6,7,9,10,11,13,14,15,17,18,19)
    val v1 = FloatArray(idx1.size * 3)
    val v2 = FloatArray(idx1.size * 3)
    for (k in idx1.indices) {
      val a = joint[idx1[k]]
      v1[k*3] = a[0]; v1[k*3+1] = a[1]; v1[k*3+2] = a[2]
      val b = joint[idx2[k]]
      v2[k*3] = b[0]; v2[k*3+1] = b[1]; v2[k*3+2] = b[2]
    }
    for (i in idx1.indices) {
      val n1 = norm(v1, i*3)
      val n2 = norm(v2, i*3)
      val dot = (v1[i*3]/n1)*(v2[i*3]/n2) +
                (v1[i*3+1]/n1)*(v2[i*3+1]/n2) +
                (v1[i*3+2]/n1)*(v2[i*3+2]/n2)
      val angle = Math.toDegrees(acos(dot.toDouble()))
      features.put(angle)
    }
    // Append hand count
    features.put(landmarksList.size.toDouble())
    return features.toString()
  }

  private fun norm(arr: FloatArray, idx: Int): Float {
    return sqrt(arr[idx]*arr[idx] + arr[idx+1]*arr[idx+1] + arr[idx+2]*arr[idx+2])
  }
}

class HandLandmarkerHelperPackage : ReactPackage {
  override fun createNativeModules(
    reactContext: ReactApplicationContext
  ): List<NativeModule> = listOf(HandLandmarkerHelperModule(reactContext))

  override fun createViewManagers(
    reactContext: ReactApplicationContext
  ): List<ViewManager<*, *>> = emptyList()
}
