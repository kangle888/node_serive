const CHARS = 'ABCDEFGHJKMNPQRSTWXYZ23456789';

export const generateInviteCode = (length = 8) => {
  let code = '';
  for (let i = 0; i < length; i += 1) {
    const idx = Math.floor(Math.random() * CHARS.length);
    code += CHARS[idx];
  }
  return code;
};


