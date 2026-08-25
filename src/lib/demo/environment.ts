import "server-only";

export function requireServerEnvironment(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required to run the DMS demo.`);
  }

  return value;
}

export function getDemoCredentials() {
  return {
    email: requireServerEnvironment("DEMO_AUTH_EMAIL"),
    password: requireServerEnvironment("DEMO_AUTH_PASSWORD"),
  };
}
