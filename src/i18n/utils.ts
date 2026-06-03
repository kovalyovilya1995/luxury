export function plural(formObj: { RUS: string[]; ENG: string[] }, n: number) {
  const lng = localStorage.getItem('lang') as null | 'RUS' | 'ENG';
  const forms = formObj[lng || 'RUS'];

  if (lng === 'ENG') {
    if (n !== 1) return forms[1];
    return forms[0];
  }

  let idx;
  // @see http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/pluralforms.html
  if (n % 10 === 1 && n % 100 !== 11) {
    idx = 0; // one
  } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
    idx = 1; // few
  } else {
    idx = 2; // many
  }
  return forms[idx] || '';
}
