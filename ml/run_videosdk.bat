@echo off
rem Activate the videosdkvenv virtual environment
call ml\videosdkvenv\Scripts\activate.bat

rem Run the videosdk_sender.py script with the meeting ID
python ml\videosdk_sender.py %1

rem Keep the terminal open to see the output
pause