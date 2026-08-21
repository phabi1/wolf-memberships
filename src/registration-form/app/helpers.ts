export function isParticipantMinor (birthdate: string | number | Date) : boolean {
  if (!birthdate) {
    return false;
  }

  const today = new Date();

  if (typeof birthdate === "string" || typeof birthdate === "number") {
    birthdate = new Date(birthdate);
  }

  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age < 18;
};