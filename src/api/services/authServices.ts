import type {
  LoginBody,
  LoginResponse,
  ChangePasswordBody,
} from "../../types/api/auth";
import { handleError } from "../../utils/handleError";

const BASE_URL = "https://sp-taskify-api.vercel.app/14-4";

// POST: 로그인
// 로그인 요청을 보내고 LoginResponse 타입의 결과를 반환하는 비동기 함수
const login = async (reqLoginBody: LoginBody): Promise<LoginResponse> => {
  // fetch는 JavaScript에서 서버에 요청을 보내는 함수
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqLoginBody), // 자바스크립트 객체를 JSON 문자열로 변환해 서버에 전송
  });

  if (!res.ok) {
    return handleError(res);
  }

  return res.json();
};

// PUT: 비밀번호 변경
const changePassword = async (reqBody: ChangePasswordBody): Promise<void> => {
  const res = await fetch(`${BASE_URL}/auth/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  });

  if (!res.ok) {
    return handleError(res);
  }

  // 204 No Content → 응답 없음, 그냥 종료
};

export const authService = {
  login,
  changePassword,
};
