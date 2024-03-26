export interface AccountData {
  username: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}
export async function saveAccountData(
  accountData: AccountData
): Promise<AccountData> {
  const response = await fetch(
    "https://enshrined-meadow-aluminum.glitch.me/accounts",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accountData),
    }
  );

  if (!response.ok) {
    throw new Error("API 호출에 실패했습니다.");
  }

  return await response.json();
}
