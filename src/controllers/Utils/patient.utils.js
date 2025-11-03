/**
 * Generate ID in format: ZVGYYYYMMDDTTDDD
 * - ZVG        = fixed prefix
 * - YYYYMMDD   = full date
 * - TT         = two-digit hour (00-23)
 * - DDD        = three-digit random suffix (100-999)
 *
 * Example: ZVG20251103 14 457 -> ZVG2025110314457
 */
export const generatePatientId = (date = new Date()) => {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const tt = String(date.getHours()).padStart(2, '0'); // two-digit hour
  const random3 = String(Math.floor(100 + Math.random() * 900)); // 100-999

  return `ZVG${yyyy}${mm}${dd}${tt}${random3}`;
};