declare module 'bcryptjs' {
  /**
   * Generate a hash for the given string.
   * @param s The string to hash.
   * @param salt The salt length to generate or the salt to use.
   */
  export function hash(s: string, salt: number | string): Promise<string>;

  /**
   * Compare the given data against the given hash.
   * @param s The string to compare.
   * @param hash The hash to compare against.
   */
  export function compare(s: string, hash: string): Promise<boolean>;

  /**
   * Generate a salt with the given number of rounds.
   * @param rounds The number of rounds to use.
   */
  export function genSalt(rounds?: number): Promise<string>;

  /**
   * Generate a hash synchronously.
   * @param s The string to hash.
   * @param salt The salt length to generate or the salt to use.
   */
  export function hashSync(s: string, salt: number | string): string;

  /**
   * Compare the given data against the given hash synchronously.
   * @param s The string to compare.
   * @param hash The hash to compare against.
   */
  export function compareSync(s: string, hash: string): boolean;

  /**
   * Generate a salt synchronously.
   * @param rounds The number of rounds to use.
   */
  export function genSaltSync(rounds?: number): string;
} 