import type { InstructionalArea } from '../utils/instructionalAreas'

/**
 * PFL uses a dedicated personal-finance instructional framework rather than the
 * finance-cluster instructional areas used by ACT, BFS, FTDM and PFN.
 * These concise practice indicators are original paraphrases of the current
 * DECA PFL topic areas, so generated practice cases do not reproduce a case or
 * evaluation form from the official case bank.
 */
export const PERSONAL_FINANCE_INDICATORS: Record<string, string[]> = {
  'Earning Income': [
    'Explain how education, skills and career choices can affect earning potential.',
    'Interpret the major earnings, taxes and deductions shown on a pay statement.',
    'Compare total compensation when evaluating employment alternatives.',
    'Explain how taxes affect take-home pay and personal financial decisions.',
    'Evaluate the tradeoffs of employee benefits, contract work and variable income.',
    'Describe strategies for increasing income through career development.',
  ],
  Spending: [
    'Create a spending plan that reflects income, needs, wants and financial goals.',
    'Use comparison shopping and unit pricing to evaluate a purchase.',
    'Explain how values, advertising and social influences affect spending choices.',
    'Evaluate the short- and long-term costs of a major purchase.',
    'Describe consumer rights, responsibilities and safe purchasing practices.',
    'Adjust a budget in response to an unexpected expense or change in income.',
  ],
  Saving: [
    'Set a specific savings goal and develop a realistic plan for reaching it.',
    'Explain the purpose and appropriate size of an emergency fund.',
    'Compare savings products by liquidity, risk, fees and potential return.',
    'Explain how compound growth and time affect savings outcomes.',
    'Prioritize competing short-, medium- and long-term savings goals.',
    'Evaluate how automatic saving can support consistent financial behavior.',
  ],
  Investing: [
    'Explain the relationship among investment risk, expected return and time horizon.',
    'Compare basic investment choices by diversification, fees, liquidity and risk.',
    'Describe how diversification can help manage investment risk.',
    'Evaluate whether an investment choice aligns with a stated goal and risk tolerance.',
    'Explain how inflation and compounding affect long-term investing.',
    'Identify warning signs of misleading investment claims and financial fraud.',
  ],
  'Managing Credit': [
    'Explain how borrowing behavior can affect a credit history and credit score.',
    'Compare credit offers using interest rate, fees, term and total repayment cost.',
    'Calculate or interpret the cost of carrying a credit balance.',
    'Recommend a responsible strategy for repaying debt.',
    'Explain the consequences of late payment, default and excessive credit use.',
    'Identify steps for reviewing and correcting errors on a credit report.',
  ],
  'Managing Risk': [
    'Identify personal financial risks and appropriate ways to manage them.',
    'Compare insurance choices using coverage, exclusions, premiums and deductibles.',
    'Explain the financial purpose of common property, health and liability coverage.',
    'Recommend steps for reducing identity-theft and payment-fraud risk.',
    'Evaluate the tradeoff between retaining risk and purchasing insurance.',
    'Describe the steps to take after a covered loss or suspected identity theft.',
  ],
}

export const PERSONAL_FINANCE_AREAS: InstructionalArea[] = Object.entries(PERSONAL_FINANCE_INDICATORS)
  .map(([name, indicators]) => ({
    name,
    code: name.split(/\s+/).map(word => word[0]).join('').toUpperCase(),
    description: `Practice indicators related to ${name.toLowerCase()}`,
    piCount: indicators.length,
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

export function getPersonalFinanceIndicators(area: string): string[] {
  return PERSONAL_FINANCE_INDICATORS[area] || []
}
