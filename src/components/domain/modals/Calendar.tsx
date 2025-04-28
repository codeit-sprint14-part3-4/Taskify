/* 달력 전체 */
.react-datepicker.my-custom-datepicker {
  font-family: 'Pretendard', sans-serif;
  font-size: 1.6rem;
  border: 1px solid var(--gray-D9D9D9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 1.2rem;
  display: flex;
}

/* 월 전체 컨테이너 */
.react-datepicker__month-container {
  width: 34rem;
}

/* 달력 헤더 */
.react-datepicker__header {
  background-color: white;
  border-color: rgb(223, 223, 223);
}

/* 현재 월 표시 */
.react-datepicker__current-month {
  font-size: 2rem;
  color: #5534da;
}

/* 요일 (일, 월, 화, ...) */
.react-datepicker__day-name {
  width: 4.8rem;
  line-height: 4.8rem;
  margin: 0 auto;
  color: #5534da;
}

/* 날짜 */
.react-datepicker__day {
  width: 4.8rem;
  line-height: 4.8rem;
  margin: 0 auto;
  border-radius: 100%;
}

/* 시간 리스트 항목 */
.react-datepicker__time-name {
  width: 4.8rem;
  line-height: 4.8rem;
  margin: 0 auto;
}

/* 시간 선택 전체 컨테이너 */
.react-datepicker__time-container {
  width: 10rem;
  border-left: 1px solid var(--gray-D9D9D9);
}

/* 시간 선택 영역 */
.react-datepicker__time-list {
  height: 27rem; /* 고정 높이 */
  overflow-y: scroll; /* 세로 스크롤 */
  font-size: 1.6rem;
  padding: 1rem;
}

/* 시간 선택 영역 내부 항목 */
.react-datepicker__time-list-item {
  padding: 0;
}

/* 시간 헤더 */
.react-datepicker-time__header {
  font-size: 1.5rem;
  color: #5534da;
}

/* 시간 리스트 박스 */
.react-datepicker__time-box {
  margin: 0;
}

/* 네비게이션 (이전, 다음) */
.react-datepicker__navigation--previous,
.react-datepicker__navigation--next {
  position: absolute;
  top: 1rem;
}

/* 다음 버튼 */
.react-datepicker__navigation--next {
  right: 12rem;
}

/* 헤더 - 시간 선택 있을 때 */
.react-datepicker__header--has-time-select {
  border-radius: 0.8rem 0 0 0;
}

/* 헤더 - 시간 영역 */
.react-datepicker__header--time {
  border-radius: 0 0.8rem 0 0;
}

/* 선택된 날짜 */
.react-datepicker__day--selected {
  background-color: #5534da;
  border-radius: 100%;
}

/* 키보드로 선택된 날짜 */
.react-datepicker__day--keyboard-selected {
  background-color: #5534da;
  border-radius: 100%;
  color: white;
}

/* 선택된 시간 */
.react-datepicker__time-list-item--selected {
  background-color: #5534da;
}
