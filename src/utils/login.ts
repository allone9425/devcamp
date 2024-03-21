export async function login(email: string, password: string): Promise<boolean> {
  const response = await fetch("http://localhost:4000/accounts");
  const accounts = await response.json();

  const account = accounts.find(
    (acc: any) => acc.email === email && acc.password === password
  );
  return Boolean(account);
}
