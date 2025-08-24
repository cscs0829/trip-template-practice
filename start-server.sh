ㅔㅛㅅ#!/bin/bash

echo "🚀 트립페이지 서버 시작 중..."

# 기존 서버가 실행 중인지 확인
if pgrep -f "server.py" > /dev/null; then
    echo "⚠️  이미 서버가 실행 중입니다!"
    echo "📊 현재 서버 상태:"
    ps aux | grep server.py | grep -v grep
    echo ""
    echo "🛑 서버를 중지하려면: ./stop-server.sh"
    exit 1
fi

# 서버 시작
echo "📡 http://localhost:8000 에서 서버 시작"
echo "📁 trippage 디렉토리: http://localhost:8000/trippage/"
echo "🛑 서버 중지: Ctrl+C 또는 ./stop-server.sh"
echo ""

python3 server.py
