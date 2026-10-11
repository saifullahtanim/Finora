// Comprehensive Global & Bangladeshi Bank Database for Finora Bank Sync
export const COUNTRIES = [
  { code: 'BD', name: 'Bangladesh', currency: 'BDT' },
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'CZ', name: 'Czech Republic', currency: 'CZK' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'IT', name: 'Italy', currency: 'EUR' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR' },
  { code: 'AD', name: 'Andorra', currency: 'EUR' },
  { code: 'AL', name: 'Albania', currency: 'ALL' },
  { code: 'AM', name: 'Armenia', currency: 'AMD' },
  { code: 'AR', name: 'Argentina', currency: 'ARS' },
  { code: 'AT', name: 'Austria', currency: 'EUR' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'KR', name: 'South Korea', currency: 'KRW' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR' },
  { code: 'ES', name: 'Spain', currency: 'EUR' },
  { code: 'SE', name: 'Sweden', currency: 'SEK' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF' },
  { code: 'TR', name: 'Turkey', currency: 'TRY' },
  { code: 'QA', name: 'Qatar', currency: 'QAR' },
  { code: 'KW', name: 'Kuwait', currency: 'KWD' },
  { code: 'OM', name: 'Oman', currency: 'OMR' },
  { code: 'PK', name: 'Pakistan', currency: 'PKR' },
  { code: 'NP', name: 'Nepal', currency: 'NPR' },
  { code: 'LK', name: 'Sri Lanka', currency: 'LKR' },
];

export const BANKS_BY_COUNTRY = {
  // Comprehensive Database of ALL Scheduled Banks & MFS in Bangladesh
  Bangladesh: [
    { id: 'bd_jamuna', name: 'Jamuna Bank PLC', type: 'Private Commercial Bank', color: '#00838F' },
    { id: 'bd_agrani', name: 'Agrani Bank PLC', type: 'State-Owned Commercial Bank', color: '#2E7D32' },
    { id: 'bd_sonali', name: 'Sonali Bank PLC', type: 'State-Owned Commercial Bank', color: '#1565C0' },
    { id: 'bd_janata', name: 'Janata Bank PLC', type: 'State-Owned Commercial Bank', color: '#00695C' },
    { id: 'bd_rupali', name: 'Rupali Bank PLC', type: 'State-Owned Commercial Bank', color: '#C2185B' },
    { id: 'bd_brac', name: 'BRAC Bank PLC', type: 'Private Commercial Bank', color: '#00529B' },
    { id: 'bd_dbbl', name: 'Dutch-Bangla Bank (DBBL)', type: 'Private Commercial Bank', color: '#D81B60' },
    { id: 'bd_city', name: 'City Bank PLC', type: 'Private Commercial Bank', color: '#E53935' },
    { id: 'bd_ebl', name: 'Eastern Bank PLC (EBL)', type: 'Private Commercial Bank', color: '#0D47A1' },
    { id: 'bd_ibbl', name: 'Islami Bank Bangladesh PLC (IBBL)', type: 'Shariah Compliant Bank', color: '#00796B' },
    { id: 'bd_mtb', name: 'Mutual Trust Bank PLC (MTB)', type: 'Private Commercial Bank', color: '#880E4F' },
    { id: 'bd_dhaka', name: 'Dhaka Bank PLC', type: 'Private Commercial Bank', color: '#1E88E5' },
    { id: 'bd_prime', name: 'Prime Bank PLC', type: 'Private Commercial Bank', color: '#1B5E20' },
    { id: 'bd_southeast', name: 'Southeast Bank PLC', type: 'Private Commercial Bank', color: '#4A148C' },
    { id: 'bd_ucb', name: 'United Commercial Bank PLC (UCB)', type: 'Private Commercial Bank', color: '#E65100' },
    { id: 'bd_pubali', name: 'Pubali Bank PLC', type: 'Private Commercial Bank', color: '#004D40' },
    { id: 'bd_national', name: 'National Bank Limited (NBL)', type: 'Private Commercial Bank', color: '#311B92' },
    { id: 'bd_scb', name: 'Standard Chartered Bangladesh', type: 'Foreign Commercial Bank', color: '#008559' },
    { id: 'bd_hsbc', name: 'HSBC Bangladesh', type: 'Foreign Commercial Bank', color: '#DB0011' },
    { id: 'bd_bankasia', name: 'Bank Asia PLC', type: 'Private Commercial Bank', color: '#01579B' },
    { id: 'bd_trust', name: 'Trust Bank PLC', type: 'Private Commercial Bank', color: '#004D40' },
    { id: 'bd_mercantile', name: 'Mercantile Bank PLC', type: 'Private Commercial Bank', color: '#B71C1C' },
    { id: 'bd_premier', name: 'Premier Bank PLC', type: 'Private Commercial Bank', color: '#BF360C' },
    { id: 'bd_exim', name: 'EXIM Bank of Bangladesh', type: 'Shariah Compliant Bank', color: '#004D40' },
    { id: 'bd_sibl', name: 'Social Islami Bank Limited (SIBL)', type: 'Shariah Compliant Bank', color: '#1B5E20' },
    { id: 'bd_alarafah', name: 'Al-Arafah Islami Bank PLC', type: 'Shariah Compliant Bank', color: '#00796B' },
    { id: 'bd_fsibl', name: 'First Security Islami Bank PLC', type: 'Shariah Compliant Bank', color: '#33691E' },
    { id: 'bd_shahjalal', name: 'Shahjalal Islami Bank PLC', type: 'Shariah Compliant Bank', color: '#004D40' },
    { id: 'bd_union', name: 'Union Bank PLC', type: 'Shariah Compliant Bank', color: '#006064' },
    { id: 'bd_global', name: 'Global Islami Bank PLC', type: 'Shariah Compliant Bank', color: '#2E7D32' },
    { id: 'bd_nrb', name: 'NRB Bank PLC', type: 'Private Commercial Bank', color: '#0D47A1' },
    { id: 'bd_nrbc', name: 'NRB Commercial Bank PLC', type: 'Private Commercial Bank', color: '#880E4F' },
    { id: 'bd_midland', name: 'Midland Bank PLC', type: 'Private Commercial Bank', color: '#00838F' },
    { id: 'bd_modhumoti', name: 'Modhumoti Bank PLC', type: 'Private Commercial Bank', color: '#2E7D32' },
    { id: 'bd_meghna', name: 'Meghna Bank PLC', type: 'Private Commercial Bank', color: '#0277BD' },
    { id: 'bd_sbac', name: 'South Bangla Agriculture & Commerce (SBAC)', type: 'Private Commercial Bank', color: '#1565C0' },
    { id: 'bd_shimanto', name: 'Shimanto Bank PLC', type: 'Private Commercial Bank', color: '#2E7D32' },
    { id: 'bd_community', name: 'Community Bank Bangladesh PLC', type: 'Private Commercial Bank', color: '#1565C0' },
    { id: 'bd_bengal', name: 'Bengal Commercial Bank PLC', type: 'Private Commercial Bank', color: '#AD1457' },
    { id: 'bd_citizens', name: 'Citizens Bank PLC', type: 'Private Commercial Bank', color: '#00838F' },
    { id: 'bd_padma', name: 'Padma Bank PLC', type: 'Private Commercial Bank', color: '#6A1B9A' },
    { id: 'bd_basic', name: 'BASIC Bank Limited', type: 'State-Owned Commercial Bank', color: '#00695C' },
    { id: 'bd_bkb', name: 'Bangladesh Krishi Bank (BKB)', type: 'Specialized Development Bank', color: '#2E7D32' },
    { id: 'bd_rakub', name: 'Rajshahi Krishi Unnayan Bank (RAKUB)', type: 'Specialized Development Bank', color: '#388E3C' },
    { id: 'bd_karmasangsthan', name: 'Karmasangsthan Bank', type: 'Specialized Financial Institution', color: '#0288D1' },
    { id: 'bd_ansar', name: 'Ansar-VDP Unnayan Bank', type: 'Specialized Financial Institution', color: '#F57C00' },
    { id: 'bd_probashi', name: 'Probashi Kallyan Bank', type: 'Specialized Financial Institution', color: '#00796B' },
    { id: 'bd_ific', name: 'IFIC Bank PLC', type: 'Private Commercial Bank', color: '#B71C1C' },
    { id: 'bd_ncc', name: 'NCC Bank PLC', type: 'Private Commercial Bank', color: '#004D40' },
    { id: 'bd_onebank', name: 'One Bank PLC', type: 'Private Commercial Bank', color: '#1A237E' },
    { id: 'bd_uttara', name: 'Uttara Bank PLC', type: 'Private Commercial Bank', color: '#0D47A1' },
    { id: 'bd_standard', name: 'Standard Bank PLC', type: 'Shariah Compliant Bank', color: '#00695C' },
    { id: 'bd_icb', name: 'ICB Islamic Bank', type: 'Shariah Compliant Bank', color: '#004D40' },
    { id: 'bd_commercial_ceylon', name: 'Commercial Bank of Ceylon', type: 'Foreign Commercial Bank', color: '#0D47A1' },
    { id: 'bd_citi', name: 'Citibank N.A. Bangladesh', type: 'Foreign Commercial Bank', color: '#003B70' },
    { id: 'bd_bkash', name: 'bKash (MFS Wallet)', type: 'Mobile Financial Service', color: '#E2136E' },
    { id: 'bd_nagad', name: 'Nagad (MFS Wallet)', type: 'Mobile Financial Service', color: '#F57C00' },
    { id: 'bd_rocket', name: 'Rocket (DBBL MFS)', type: 'Mobile Financial Service', color: '#8E24AA' },
    { id: 'bd_upay', name: 'Upay (UCB MFS)', type: 'Mobile Financial Service', color: '#00838F' },
    { id: 'bd_cellfin', name: 'Cellfin (IBBL Smart MFS)', type: 'Digital Banking App', color: '#00796B' },
  ],

  // India
  India: [
    { id: 'in_yes', name: 'YES BANK (Corporate)', type: 'Private Bank', color: '#004B87' },
    { id: 'in_catholic', name: 'Catholic Syrian Bank', type: 'Private Bank', color: '#B71C1C' },
    { id: 'in_baroda', name: 'Bank of Baroda', type: 'Public Sector Bank', color: '#F26522' },
    { id: 'in_dbs', name: 'DBS Bank', type: 'Foreign Bank', color: '#E31837' },
    { id: 'in_scb', name: 'Standard Chartered Bank', type: 'Foreign Bank', color: '#008559' },
    { id: 'in_karur', name: 'Karur Vysya Bank', type: 'Private Bank', color: '#008080' },
    { id: 'in_sbi', name: 'State Bank of India (SBI)', type: 'Public Sector Bank', color: '#280071' },
    { id: 'in_hdfc', name: 'HDFC Bank', type: 'Private Bank', color: '#004C8F' },
    { id: 'in_icici', name: 'ICICI Bank', type: 'Private Bank', color: '#F37021' },
    { id: 'in_axis', name: 'Axis Bank', type: 'Private Bank', color: '#97144D' },
    { id: 'in_kotak', name: 'Kotak Mahindra Bank', type: 'Private Bank', color: '#ED1C24' },
    { id: 'in_pnb', name: 'Punjab National Bank (PNB)', type: 'Public Sector Bank', color: '#A20000' },
  ],

  // Czech Republic (matching user screenshot 3 & 4)
  'Czech Republic': [
    { id: 'cz_csas', name: 'Česká spořitelna', type: 'Commercial Bank', color: '#0072BC' },
    { id: 'cz_csob', name: 'ČSOB', type: 'Commercial Bank', color: '#003366' },
    { id: 'cz_kb', name: 'Komerční banka (KB)', type: 'Commercial Bank', color: '#990000' },
    { id: 'cz_raiff', name: 'Raiffeisenbank', type: 'Commercial Bank', color: '#FFEE00' },
    { id: 'cz_moneta', name: 'MONETA Money Bank', type: 'Commercial Bank', color: '#009933' },
    { id: 'cz_fio', name: 'Fio banka', type: 'Digital Bank', color: '#3399CC' },
    { id: 'cz_airbank', name: 'Air Bank', type: 'Digital Bank', color: '#80B600' },
    { id: 'cz_unicredit', name: 'UniCredit Bank Czech Republic', type: 'Commercial Bank', color: '#E2001A' },
  ],

  // United States
  'United States': [
    { id: 'us_chase', name: 'JPMorgan Chase', type: 'Commercial Bank', color: '#117ACA' },
    { id: 'us_bofa', name: 'Bank of America', type: 'Commercial Bank', color: '#012169' },
    { id: 'us_wells', name: 'Wells Fargo', type: 'Commercial Bank', color: '#CD1409' },
    { id: 'us_citi', name: 'Citibank', type: 'Commercial Bank', color: '#003B70' },
    { id: 'us_capone', name: 'Capital One', type: 'Commercial Bank', color: '#004977' },
    { id: 'us_usbank', name: 'U.S. Bank', type: 'Commercial Bank', color: '#0C2340' },
    { id: 'us_pnc', name: 'PNC Bank', type: 'Commercial Bank', color: '#F48024' },
    { id: 'us_td', name: 'TD Bank USA', type: 'Commercial Bank', color: '#008A00' },
    { id: 'us_schwab', name: 'Charles Schwab Bank', type: 'Brokerage & Bank', color: '#00A3E0' },
    { id: 'us_fidelity', name: 'Fidelity Cash Management', type: 'Brokerage & Bank', color: '#387C2B' },
  ],

  // United Kingdom
  'United Kingdom': [
    { id: 'uk_barclays', name: 'Barclays Bank', type: 'Commercial Bank', color: '#00AEEF' },
    { id: 'uk_hsbc', name: 'HSBC UK', type: 'Commercial Bank', color: '#DB0011' },
    { id: 'uk_lloyds', name: 'Lloyds Bank', type: 'Commercial Bank', color: '#006A4E' },
    { id: 'uk_natwest', name: 'NatWest', type: 'Commercial Bank', color: '#4E1158' },
    { id: 'uk_santander', name: 'Santander UK', type: 'Commercial Bank', color: '#EC0000' },
    { id: 'uk_monzo', name: 'Monzo Bank', type: 'Digital Challenger Bank', color: '#FF365D' },
    { id: 'uk_revolut', name: 'Revolut UK', type: 'Neobank', color: '#0075FF' },
    { id: 'uk_starling', name: 'Starling Bank', type: 'Digital Challenger Bank', color: '#6935FF' },
  ],

  // United Arab Emirates
  'United Arab Emirates': [
    { id: 'ae_enbd', name: 'Emirates NBD', type: 'Commercial Bank', color: '#002B49' },
    { id: 'ae_adcb', name: 'Abu Dhabi Commercial Bank (ADCB)', type: 'Commercial Bank', color: '#C8102E' },
    { id: 'ae_fab', name: 'First Abu Dhabi Bank (FAB)', type: 'Commercial Bank', color: '#002B49' },
    { id: 'ae_dib', name: 'Dubai Islamic Bank (DIB)', type: 'Islamic Bank', color: '#008037' },
    { id: 'ae_mashreq', name: 'Mashreq Bank', type: 'Commercial Bank', color: '#F68B1F' },
    { id: 'ae_rak', name: 'RAKBANK', type: 'Commercial Bank', color: '#D50000' },
  ],

  // Saudi Arabia
  'Saudi Arabia': [
    { id: 'sa_rajhi', name: 'Al Rajhi Bank', type: 'Islamic Bank', color: '#0B2341' },
    { id: 'sa_snb', name: 'Saudi National Bank (SNB / AlAhli)', type: 'Commercial Bank', color: '#006A4E' },
    { id: 'sa_riyad', name: 'Riyad Bank', type: 'Commercial Bank', color: '#00205B' },
    { id: 'sa_alinma', name: 'Alinma Bank', type: 'Islamic Bank', color: '#B38F4E' },
    { id: 'sa_bsf', name: 'Banque Saudi Fransi (BSF)', type: 'Commercial Bank', color: '#003366' },
  ],

  // Canada
  Canada: [
    { id: 'ca_rbc', name: 'Royal Bank of Canada (RBC)', type: 'Commercial Bank', color: '#0051A5' },
    { id: 'ca_td', name: 'TD Canada Trust', type: 'Commercial Bank', color: '#008A00' },
    { id: 'ca_scotia', name: 'Scotiabank', type: 'Commercial Bank', color: '#EC111A' },
    { id: 'ca_bmo', name: 'Bank of Montreal (BMO)', type: 'Commercial Bank', color: '#0079C1' },
    { id: 'ca_cibc', name: 'CIBC', type: 'Commercial Bank', color: '#9B111E' },
    { id: 'ca_nbc', name: 'National Bank of Canada', type: 'Commercial Bank', color: '#E4002B' },
  ],
};

// Returns bank list for given country or fallback
export const getBanksForCountry = (countryName) => {
  if (!countryName) return BANKS_BY_COUNTRY['Bangladesh'];
  const matchedKey = Object.keys(BANKS_BY_COUNTRY).find(
    (k) => k.toLowerCase() === countryName.toLowerCase()
  );
  if (matchedKey) return BANKS_BY_COUNTRY[matchedKey];

  // Return standard global banks if specific country not in list
  return [
    { id: 'global_scb', name: 'Standard Chartered Bank', type: 'International Bank', color: '#008559' },
    { id: 'global_hsbc', name: 'HSBC International', type: 'International Bank', color: '#DB0011' },
    { id: 'global_citi', name: 'Citibank N.A.', type: 'International Bank', color: '#003B70' },
    { id: 'global_dbs', name: 'DBS Bank', type: 'International Bank', color: '#E31837' },
    { id: 'global_other', name: `${countryName} National Commercial Bank`, type: 'National Bank', color: '#0097A7' },
  ];
};
