@echo off
rem Activate the inferencevenv virtual environment
call ml\inferencevenv\Scripts\activate.bat

rem Run the testtestONNX.py script
python ml\testtestONNX.py

rem Keep the terminal open to see the output
pause