export const generateTransactionID = (prefix: string): string => {
  // If the prefix is shorter than 3 characters, pad it with random uppercase characters
  if (prefix.length < 3) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    while (prefix.length < 3) {
      const randomChar = characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
      prefix += randomChar;
    }
  }

  // If the prefix is longer than 3 characters, slice the first 3 characters
  if (prefix.length > 3) {
    prefix = prefix.slice(0, 3);
  }

  // Convert prefix to uppercase
  prefix = prefix.toUpperCase();

  const [seconds, nanoseconds] = process.hrtime();
  const microseconds = Math.floor(nanoseconds / 100);
  const formattedSeconds = String(seconds).slice(-7);
  const formattedMicroseconds = String(microseconds).padStart(7, "0");
  const randomPart = String(Math.floor(Math.random() * 1000000)).padStart(
    6,
    "0"
  );

  return `${prefix.toUpperCase()}-${formattedSeconds}${formattedMicroseconds}${randomPart}`;
};

export const generateRandomNumber = (): number => {
  const timestamp = performance.now();

  const randomNumber = Number(timestamp.toString().split(".").join(""));
  return randomNumber;
};
