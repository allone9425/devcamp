export async function login(email: string, password: string): Promise<boolean> {
  const response = await fetch(
    "https://simplistic-respected-blackcurrant.glitch.me/accounts"
  );
  const accounts = await response.json();

  const account = accounts.find(
    (acc: any) => acc.email === email && acc.password === password
  );
  return Boolean(account);
}
