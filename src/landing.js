// 첫 화면 채팅방에 순서대로 나타나는 내용과 타이밍(ms).
// 문구를 바꿀 때는 이 파일만 고치면 된다.

export const roomName = '#dugout'

export const introMessage = ['선수의 메시지는 모든 팬에게,', '내 답장은 선수에게만 가요']

export const ticket = {
  label: 'ADMIT ONE',
  seat: '더그아웃 1:1석',
  title: '내 선수와의 대화',
  stub: '입장',
}

export const lockedReply = '입장하면 답장할 수 있어요'

// 입력 중 → 설명 메시지 → 입력 중 → 티켓 도착 후 정지
export const timeline = {
  typing1: 300,
  message: 1700,
  typing2: 2200,
  ticket: 3400,
}

// 티켓 찢기: 이 시점에 다음 화면으로 넘어간다 (애니메이션 종료를 기다리지 않음)
export const tearNavigateAt = 280
