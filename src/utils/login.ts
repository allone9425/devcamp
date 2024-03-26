interface AccountInfo {
  id?: string;
  username: string;
  email: string;
  phone: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
}
export async function login(
  email: string,
  password: string
): Promise<AccountInfo | null> {
  const response = await fetch(
    "https://enshrined-meadow-aluminum.glitch.me/accounts"
  );
  const accounts = await response.json();

  const account = accounts.find(
    (acc: AccountInfo) => acc.email === email && acc.password === password
  );

  if (account) {
    // 로그인 성공 시, 사용자의 email, username, phone 반환
    return {
      email: account.email,
      username: account.username,
      phone: account.phone,
    };
  } else {
    // 로그인 실패 시, null 반환
    return null;
  }
}
