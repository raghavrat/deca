import { TEST_BLUEPRINTS, type TestCategory } from './testBlueprints'

export type PracticeQuestionDifficulty = 'foundational' | 'intermediate' | 'advanced'

export interface AuthoredPracticeQuestion {
  id: string
  blueprintId: string
  text: string
  answers: [string, string, string, string]
  correctAnswer: number
  explanation: string
  difficulty: PracticeQuestionDifficulty
}

const authored = (
  id: string,
  blueprintId: string,
  text: string,
  answers: [string, string, string, string],
  correctAnswer: number,
  explanation: string,
  difficulty: PracticeQuestionDifficulty,
): AuthoredPracticeQuestion => ({ id, blueprintId, text, answers, correctAnswer, explanation, difficulty })

/**
 * Original Deca Pal-authored practice questions. These questions were written
 * from the first-party concept blueprints in testBlueprints.ts and do not copy,
 * adapt, or reconstruct questions from an official or third-party exam bank.
 */
const CORE_PRACTICE_QUESTIONS: AuthoredPracticeQuestion[] = [
  authored(
    'mgmt-delegation-1',
    'mgmt-delegation',
    'A supervisor asks a new analyst to prepare a weekly inventory report. The analyst understands the software but has never produced this report, and it is due Friday. Which delegation approach gives the analyst useful ownership while protecting the deadline?',
    [
      'Define the required result, grant access, set a Wednesday check-in, and remain available for questions.',
      'Complete the report personally because a new analyst should never receive deadline-sensitive work.',
      'Assign the report without instructions so the analyst can demonstrate complete independence.',
      'Give the analyst every inventory task performed by the department so responsibility is not divided.',
    ],
    0,
    'The first approach specifies the outcome, authority, resources, and a timely checkpoint. It allows the analyst to do the work while the supervisor retains accountability and can address problems before Friday.',
    'foundational',
  ),
  authored(
    'mgmt-delegation-2',
    'mgmt-delegation',
    'An experienced coordinator has capacity to run a routine supplier meeting. The department manager normally runs it but needs time for a budget deadline. What is the strongest reason to delegate the meeting with a clear agenda and decision limits?',
    [
      'It uses the coordinator’s readiness while preserving the manager’s accountability for the outcome.',
      'It permanently transfers accountability for all supplier relationships to the coordinator.',
      'It guarantees that no follow-up or review will be needed after the meeting.',
      'It prevents the coordinator from making any judgment during the discussion.',
    ],
    0,
    'The coordinator has the readiness and capacity for the assignment. A clear agenda and decision limits provide appropriate authority, but the manager still owns the department’s result and should review important follow-up items.',
    'intermediate',
  ),
  authored(
    'mgmt-operations-1',
    'mgmt-operations',
    'A service request moves through intake, technical review, and approval. Those stages can process 24, 11, and 20 requests per hour respectively, and demand is 18 requests per hour. Where should the manager first focus an effort to increase total throughput?',
    [
      'Technical review, because its capacity constrains the entire process.',
      'Intake, because it is the first stage customers encounter.',
      'Approval, because every request ends at that stage.',
      'All three stages equally, regardless of their current capacity.',
    ],
    0,
    'Technical review can handle only 11 requests per hour, less than both demand and the other stages. Improving intake or approval alone would not raise the process above the technical-review bottleneck.',
    'intermediate',
  ),
  authored(
    'mgmt-operations-2',
    'mgmt-operations',
    'A fulfillment team shortened label printing by two minutes, but completed orders per hour did not increase. Packing still takes twelve minutes per order and has a growing queue. What should the team conclude from this result?',
    [
      'The printing change affected a non-bottleneck, so the packing constraint should be investigated next.',
      'The improvement failed because cycle time can never be changed in a fulfillment process.',
      'The team should reverse the printing change before measuring packing performance.',
      'The queue proves that customer demand must be reduced rather than process capacity increased.',
    ],
    0,
    'A local time reduction does not increase end-to-end output when another step limits throughput. The queue and long packing time point to packing as the likely constraint that should be measured and improved.',
    'intermediate',
  ),
  authored(
    'mgmt-projects-1',
    'mgmt-projects',
    'A website launch requires product data to be imported before the checkout team can run its final tests. The import is two days late, while an unrelated color review is also unfinished. Which task should the project lead prioritize first?',
    [
      'Complete the product-data import because final checkout testing depends on it.',
      'Finish the color review because visual work is easier to demonstrate to executives.',
      'Begin final checkout testing without data so the original calendar appears unchanged.',
      'Add new site features while waiting so every team remains busy.',
    ],
    0,
    'The delayed import blocks a dependent task on the launch path. Addressing that dependency first protects the schedule; unrelated cosmetic work and new scope do not remove the testing constraint.',
    'foundational',
  ),
  authored(
    'mgmt-projects-2',
    'mgmt-projects',
    'Halfway through a six-week implementation, a sponsor requests an additional reporting dashboard. The team can build it, but the work may affect testing time and contractor cost. What should the project manager do before accepting it?',
    [
      'Estimate the effects on scope, schedule, cost, and quality, then obtain an informed decision.',
      'Approve it immediately because requests from sponsors are outside the project scope process.',
      'Reject it automatically because a project can never change after work begins.',
      'Ask the team to build it secretly so the published schedule does not need revision.',
    ],
    0,
    'A scope request should be evaluated before commitment. Showing its likely schedule, cost, testing, and quality effects lets the authorized decision-maker weigh the added value against the project tradeoffs.',
    'intermediate',
  ),
  authored(
    'mgmt-hr-1',
    'mgmt-hr',
    'A new employee submits customer notes in several formats. The supervisor discovers that no required format was included in training or written procedures. What is the fairest first response to the performance gap?',
    [
      'Explain and demonstrate the expected format, provide an example, and review the next submission.',
      'Issue a final warning because employees are responsible for guessing undocumented standards.',
      'Lower the standard for the entire team so the employee’s current work becomes acceptable.',
      'Transfer the employee immediately without discussing the specific problem.',
    ],
    0,
    'The evidence points to an unclear expectation rather than refusal or lack of effort. The supervisor should make the standard observable, supply guidance, and check the employee’s next attempt before choosing further action.',
    'foundational',
  ),
  authored(
    'mgmt-hr-2',
    'mgmt-hr',
    'A trained representative meets the call-quality standard when the customer system works, but recurring outages prevent account access and lengthen calls. Which management response best addresses the evidence?',
    [
      'Repair or provide a workaround for the system constraint and then reassess performance.',
      'Require the representative to speak faster even though account data remains unavailable.',
      'Remove all quality expectations until the system is replaced several years from now.',
      'Treat the outages as proof that the representative lacks the necessary communication skill.',
    ],
    0,
    'Performance varies with an identified resource constraint, not with the employee’s demonstrated skill. Management should address the system problem or an approved workaround before attributing the gap to the representative.',
    'intermediate',
  ),
  authored(
    'mgmt-ethics-1',
    'mgmt-ethics',
    'A purchasing manager is assigned to score three bids and realizes that one supplier is owned by the manager’s sibling. The relationship has not been disclosed. What action makes the selection process most defensible?',
    [
      'Disclose the conflict and follow the organization’s recusal or independent-review procedure.',
      'Score the sibling’s bid privately and disclose the relationship only if that supplier wins.',
      'Give the sibling’s company a lower score solely to prove that no favoritism occurred.',
      'Tell the other suppliers to withdraw so the conflict no longer affects a comparison.',
    ],
    0,
    'Disclosure and an independent process manage both actual bias and the appearance of bias. Secret scoring or deliberately changing a score would not apply the purchasing standards consistently or transparently.',
    'foundational',
  ),
  authored(
    'mgmt-ethics-2',
    'mgmt-ethics',
    'A manager approves weekend scheduling exceptions for favored employees but denies identical requests from others without explanation. Which change would most improve the ethical quality of these decisions?',
    [
      'Use relevant written criteria consistently and explain how each request was evaluated.',
      'Continue making private exceptions so employees cannot compare the decisions.',
      'Approve every request regardless of staffing consequences or customer commitments.',
      'Base future exceptions on which employees have worked for the manager the longest.',
    ],
    0,
    'Consistent, job-relevant criteria reduce favoritism and make decisions explainable to affected stakeholders. Automatic approval ignores consequences, while secrecy and personal loyalty do not correct the unequal standard.',
    'intermediate',
  ),
  authored(
    'mgmt-data-1',
    'mgmt-data',
    'A clinic reports an average customer wait of six minutes, yet afternoon complaints are increasing. Morning waits average two minutes and afternoon waits average fourteen. What information should the manager use next?',
    [
      'Wait-time distributions by time period and service stage rather than the overall average alone.',
      'The overall average only, because segmenting data always makes a metric less reliable.',
      'The number of chairs in the lobby, without connecting it to customer flow.',
      'A competitor’s annual revenue, because it is a larger number than the wait-time measures.',
    ],
    0,
    'The overall average hides meaningful variation between morning and afternoon service. Breaking wait time down by period and stage can reveal when and where the delay occurs and support a relevant response.',
    'intermediate',
  ),
  authored(
    'mgmt-data-2',
    'mgmt-data',
    'A director observes that branches with higher voluntary training completion also report higher sales. The director claims the training caused the difference, but branch size and local demand were not examined. What is the central weakness?',
    [
      'The observed correlation does not establish causation when other explanations remain untested.',
      'Sales information can never be compared with employee information under any circumstances.',
      'Voluntary participation automatically makes every result representative of all branches.',
      'A relationship between two measures proves the measure with the larger value caused the other.',
    ],
    0,
    'The two measures move together, but branch size, demand, employee selection, or other factors may explain the pattern. A causal conclusion requires stronger evidence than this uncontrolled correlation.',
    'advanced',
  ),

  authored(
    'mkt-segmentation-1',
    'mkt-segmentation',
    'A refillable-cleaner company can identify households that reorder concentrate every six weeks, reach them through its subscription portal, and measure their retention. Why is this group more useful than the segment “people who like clean homes”?',
    [
      'It is measurable, reachable, and based on behavior that can support a distinct offer.',
      'It includes every possible buyer, so the company never has to choose a target.',
      'It is defined only by a broad attitude that cannot be observed or acted upon.',
      'It guarantees that every household in the group will purchase at the same price.',
    ],
    0,
    'The reorder pattern defines an observable group the company can reach and serve through a relevant subscription offer. The broader statement is difficult to measure and does not distinguish actionable customer needs or behavior.',
    'foundational',
  ),
  authored(
    'mkt-segmentation-2',
    'mkt-segmentation',
    'A software company chooses independent design studios as the customers it will serve, then describes its product as the simplest approval tool for small creative teams. Which statement correctly distinguishes these two decisions?',
    [
      'Choosing the studios is targeting; defining the intended perception is positioning.',
      'Choosing the studios is positioning; setting the intended perception is distribution.',
      'Both decisions are pricing because they may eventually affect willingness to pay.',
      'Both decisions are undifferentiated marketing because they mention a particular customer group.',
    ],
    0,
    'Targeting selects the segment the company intends to serve. Positioning defines how the offer should be understood relative to alternatives in that selected customer’s mind.',
    'intermediate',
  ),
  authored(
    'mkt-research-1',
    'mkt-research',
    'A gym wants to learn why members cancel. Its draft survey asks, “How much did our inconvenient hours cause you to leave?” What is the most important improvement before sending the survey?',
    [
      'Replace the leading wording with neutral questions that allow multiple possible reasons.',
      'Send it only to current employees because they already understand the gym.',
      'Remove every open response so members cannot mention an unexpected reason.',
      'Ask only members who renewed, because they are easiest to contact.',
    ],
    0,
    'The draft assumes that inconvenient hours caused cancellation and can steer respondents toward that answer. Neutral wording and coverage of former members would produce evidence better aligned with the decision.',
    'foundational',
  ),
  authored(
    'mkt-research-2',
    'mkt-research',
    'A bakery is considering redesigned packaging and needs to know whether customers can locate the allergen notice quickly. Which research method provides the most decision-relevant primary evidence?',
    [
      'Observe representative customers completing a timed package-finding task with each design.',
      'Read a five-year-old article about national bakery sales without showing either design.',
      'Ask the package designer whether the notice seems easy to find.',
      'Count social-media followers even though neither package has been displayed there.',
    ],
    0,
    'A task using the actual alternatives directly measures whether intended customers can find the notice. The other options are indirect, outdated, or supplied by a party whose opinion does not answer the customer-use question.',
    'intermediate',
  ),
  authored(
    'mkt-pricing-1',
    'mkt-pricing',
    'A workshop charges $75 per seat and incurs $27 in materials and payment fees for each attendee. Venue rent is fixed for the event. What is the contribution per additional seat sold?',
    [
      '$48',
      '$27',
      '$75',
      '$102',
    ],
    0,
    'Contribution per unit is selling price minus variable unit cost. The calculation is $75 minus $27, producing $48 that can help cover fixed venue cost and then profit.',
    'foundational',
  ),
  authored(
    'mkt-pricing-2',
    'mkt-pricing',
    'A product sells for $100 with a $60 variable cost and currently sells 200 units. A proposed $90 price would leave the same variable cost. Ignoring fixed costs, what minimum whole-number sales volume would exceed the current total contribution?',
    [
      '267 units',
      '201 units',
      '225 units',
      '250 units',
    ],
    0,
    'Current contribution is ($100 − $60) × 200 = $8,000. At the lower price, contribution is $30 per unit, so 267 units produce $8,010; 266 would produce only $7,980.',
    'advanced',
  ),
  authored(
    'mkt-promotion-1',
    'mkt-promotion',
    'A new nonprofit campaign has the immediate objective of increasing awareness among local parents before registration opens. Which measure is most closely aligned with that objective?',
    [
      'Change in aided and unaided awareness within the intended parent audience.',
      'Total annual operating cost across every nonprofit program.',
      'Number of registrations completed before the registration system opens.',
      'Average employee tenure at the agency that designed the campaign.',
    ],
    0,
    'Audience awareness measures the stated early-stage objective directly. Registrations are a later outcome, while operating cost and agency tenure do not show whether the intended audience recognizes the program.',
    'foundational',
  ),
  authored(
    'mkt-promotion-2',
    'mkt-promotion',
    'A retailer wants to test two email subject lines. Version A goes to recent customers on Monday morning, while version B goes to prospects on Friday night. Why will the open-rate comparison be difficult to interpret?',
    [
      'Audience and send time changed along with the subject line, creating alternative explanations.',
      'An experiment must always test at least four subject lines to produce any information.',
      'Open rate can be compared only when both emails use different products and different prices.',
      'The result is automatically causal because both messages were sent during the same week.',
    ],
    0,
    'A useful test keeps major conditions similar while changing the variable of interest. Here customer type and timing differ, so any open-rate change cannot be attributed confidently to the subject line.',
    'intermediate',
  ),
  authored(
    'mkt-channels-1',
    'mkt-channels',
    'A specialty manufacturer is choosing between selling from its own website and using regional distributors. It values direct customer feedback but lacks local delivery capability. Which comparison is most relevant?',
    [
      'Direct selling offers more customer control, while distributors may add logistics and regional reach.',
      'Direct selling eliminates all fulfillment work, while distributors always eliminate customer access.',
      'Both channels provide identical control, cost, reach, and service responsibilities.',
      'Distributors are useful only when a manufacturer wants to stop selling the product entirely.',
    ],
    0,
    'The channel choice involves a real tradeoff. A direct website can strengthen control and feedback, while intermediaries may contribute delivery capability, local knowledge, and reach that the manufacturer lacks.',
    'intermediate',
  ),
  authored(
    'mkt-channels-2',
    'mkt-channels',
    'Independent retailers complain that a brand’s own website promotes the same items below the minimum price retailers were told to maintain. What channel problem is the brand experiencing?',
    [
      'Channel conflict caused by inconsistent pricing and competing routes to the same customers.',
      'Market segmentation caused by measuring customers with different demographic variables.',
      'Product obsolescence caused by an item reaching the end of its physical life.',
      'Primary research caused by collecting new information for a current decision.',
    ],
    0,
    'The producer’s direct channel is competing with retail partners under inconsistent pricing expectations. Their goals and selling routes collide, which is a classic source of channel conflict.',
    'foundational',
  ),
  authored(
    'mkt-customer-1',
    'mkt-customer',
    'A meal-delivery service sees cancellations rise after repeated late deliveries. Support proposes sending every departing customer a discount while delivery operations remain unchanged. What is the stronger retention response?',
    [
      'Correct the recurring delivery failure and use targeted recovery for customers who experienced it.',
      'Increase advertising impressions without measuring whether delivery reliability improves.',
      'Hide the cancellation reason field so the churn report contains fewer complaints.',
      'Offer larger discounts indefinitely while accepting the same late-delivery rate.',
    ],
    0,
    'The evidence identifies a service failure that discounts alone do not solve. Fixing the operational cause protects future customer value, while proportionate recovery can address customers already affected.',
    'intermediate',
  ),
  authored(
    'mkt-customer-2',
    'mkt-customer',
    'Two customer groups each spend $400 per year. Group A produces a $160 annual margin, stays about four years, and costs $40 per year to support. Group B produces a $190 margin, stays two years, and costs $20 per year to support. Which group has greater simplified lifetime contribution?',
    [
      'Group A, with approximately $480.',
      'Group B, with approximately $680.',
      'Both groups, because their annual spending is identical.',
      'Group B, with approximately $760.',
    ],
    0,
    'Using (annual margin − annual support cost) × years, Group A contributes ($160 − $40) × 4 = $480. Group B contributes ($190 − $20) × 2 = $340, despite its higher annual margin.',
    'advanced',
  ),

  authored(
    'fin-statements-1',
    'fin-statements',
    'A consulting firm completes $8,000 of work in December and invoices the client with payment due in January. Under accrual accounting, which result can occur in December?',
    [
      'Revenue and profit can increase before the related cash is collected.',
      'Cash must increase by $8,000 on the same day the invoice is sent.',
      'The work cannot affect any statement until the client pays.',
      'The invoice automatically reduces both revenue and accounts receivable.',
    ],
    0,
    'The completed work can be recognized as revenue with a corresponding receivable even though collection occurs later. This timing difference is one reason reported profit and cash flow can diverge.',
    'foundational',
  ),
  authored(
    'fin-statements-2',
    'fin-statements',
    'A company records monthly depreciation on equipment purchased and paid for last year. How does this month’s depreciation normally affect the current period?',
    [
      'It reduces reported income without requiring a new cash payment this month.',
      'It increases current cash because every expense creates a cash receipt.',
      'It removes the equipment’s entire recorded value in a single month.',
      'It is recorded only on the cash-flow statement and never affects income.',
    ],
    0,
    'Depreciation allocates the asset’s cost across periods and is a noncash expense in the month recorded. The original equipment purchase involved cash earlier, so current income can fall without a current payment.',
    'intermediate',
  ),
  authored(
    'fin-cash-1',
    'fin-cash',
    'A growing wholesaler reports a profit, but most sales are on 60-day credit and it bought a large amount of inventory for next quarter. Why might the business still face a cash shortage?',
    [
      'Cash is tied up in receivables and inventory before customer collections arrive.',
      'A profitable company is legally prohibited from holding cash during a growth period.',
      'Credit sales always reduce reported revenue until every invoice is collected.',
      'Inventory purchases automatically create an equal cash receipt from suppliers.',
    ],
    0,
    'Profit recognizes economic activity using accounting timing, while cash depends on actual receipts and payments. Slow collections and inventory purchases can consume cash even during profitable growth.',
    'foundational',
  ),
  authored(
    'fin-cash-2',
    'fin-cash',
    'A business expects $30,000 of customer receipts on the 28th but must make a $22,000 payroll payment on the 15th. Its opening cash is $10,000. Which tool would reveal the midmonth funding gap most clearly?',
    [
      'A cash forecast organized by the expected dates of receipts and payments.',
      'An annual revenue total that ignores when customers will pay.',
      'A list of product names sorted alphabetically.',
      'A customer-satisfaction average without any payment information.',
    ],
    0,
    'The opening cash cannot cover the payroll before the later customer receipts arrive. A time-based cash forecast exposes this timing gap so the business can change payment timing or arrange funding.',
    'intermediate',
  ),
  authored(
    'fin-break-even-1',
    'fin-break-even',
    'A training provider has $12,000 in fixed launch costs, charges $50 per enrollment, and incurs $30 in variable cost per enrollment. How many enrollments are required to break even?',
    [
      '600',
      '240',
      '400',
      '1,500',
    ],
    0,
    'Contribution per enrollment is $50 − $30 = $20. Dividing $12,000 of fixed cost by the $20 contribution gives a break-even volume of 600 enrollments.',
    'foundational',
  ),
  authored(
    'fin-break-even-2',
    'fin-break-even',
    'A company calculates break-even volume using one selling price and one variable cost per unit. A supplier then announces a variable-cost increase. What should the company do before relying on the old break-even result?',
    [
      'Recalculate contribution and break-even volume using the revised cost assumption.',
      'Keep the old result because break-even volume never changes after it is first calculated.',
      'Remove fixed costs from the calculation so the supplier change has no effect.',
      'Add revenue and variable cost together and divide the total by units sold.',
    ],
    0,
    'Break-even depends on the stated price, variable cost, fixed cost, and sales mix. A higher variable cost lowers unit contribution and therefore changes the volume needed to cover fixed costs.',
    'intermediate',
  ),
  authored(
    'fin-credit-1',
    'fin-credit',
    'Loan A and Loan B have the same principal and interest rate. Loan B stretches repayment over two additional years and therefore has a lower monthly payment. What should the borrower verify before calling Loan B cheaper?',
    [
      'The total interest and fees paid over the full repayment term.',
      'Only the first monthly payment, because later payments do not affect borrowing cost.',
      'Whether the lender’s logo uses fewer colors than the other lender’s logo.',
      'The number of employees at each lender, regardless of the loan terms.',
    ],
    0,
    'A longer term can lower each payment while increasing the number of payments and total interest. Comparing total cost, fees, timing, and repayment capacity is stronger than comparing monthly payment alone.',
    'foundational',
  ),
  authored(
    'fin-credit-2',
    'fin-credit',
    'For the same one-year loan amount, Offer A charges $900 interest plus a $100 fee. Offer B charges $1,100 interest with no fee. Assuming no other differences, which offer has the lower stated borrowing cost?',
    [
      'Offer A, by $100.',
      'Offer B, by $900.',
      'The offers cost the same because only interest should be compared.',
      'Offer A, by $1,000.',
    ],
    0,
    'Offer A costs $900 + $100 = $1,000. Offer B costs $1,100, so Offer A is lower by $100. A useful comparison includes fees as well as stated interest.',
    'intermediate',
  ),
  authored(
    'fin-investment-1',
    'fin-investment',
    'A person expects to need an emergency fund within the next six months and cannot tolerate a large loss of principal. Which characteristics should receive the greatest weight when choosing where to hold it?',
    [
      'Liquidity and stability appropriate to the short time horizon.',
      'Maximum possible long-term return regardless of short-term price changes.',
      'Concentration in one volatile asset so the account is easier to monitor.',
      'A withdrawal restriction that prevents access during an emergency.',
    ],
    0,
    'The money may be needed soon, so ready access and limited short-term volatility fit the goal. Pursuing maximum return or accepting withdrawal restrictions would conflict with the stated emergency need.',
    'foundational',
  ),
  authored(
    'fin-investment-2',
    'fin-investment',
    'An investor owns shares in five companies, but all five depend on the same commodity and usually decline together when its price rises. What concentration risk remains?',
    [
      'The holdings share a common economic exposure despite having different company names.',
      'No risk remains because owning any five securities guarantees complete diversification.',
      'Liquidity risk is eliminated because every company uses the same commodity.',
      'The portfolio’s return is fixed because all five companies operate in related markets.',
    ],
    0,
    'The number of holdings alone does not establish useful diversification. Because each company responds to the same commodity exposure, one adverse change can affect the entire portfolio at once.',
    'intermediate',
  ),
  authored(
    'fin-controls-1',
    'fin-controls',
    'One employee can create a supplier, approve its invoice, release payment, and edit the accounting record. Which control would most directly reduce the risk created by this arrangement?',
    [
      'Separate supplier setup, payment authorization, and recordkeeping among appropriate people.',
      'Give the same employee a second password that unlocks all four tasks more quickly.',
      'Stop documenting supplier changes so no record can be altered later.',
      'Allow every employee to release payments without approval when the office is busy.',
    ],
    0,
    'Separating authorization, custody of payment capability, and recordkeeping makes concealed error or misuse harder. More access or less documentation would weaken accountability instead of reducing the risk.',
    'foundational',
  ),
  authored(
    'fin-controls-2',
    'fin-controls',
    'At month-end, an accountant compares the company ledger with an independently issued bank statement and investigates unmatched items. What control is being performed?',
    [
      'A reconciliation between independent records.',
      'A sales forecast based only on expected customer demand.',
      'A market segment analysis based on customer characteristics.',
      'A delegation plan that transfers accountability to the bank.',
    ],
    0,
    'A reconciliation compares separate records of the same activity and explains differences. Using the bank’s independent record can reveal missing entries, timing items, mistakes, or unauthorized transactions.',
    'foundational',
  ),

  authored(
    'hosp-recovery-1',
    'hosp-recovery',
    'A hotel assigns a guest an occupied room after a long trip. Another clean room is available, and the front-desk employee is authorized to move the guest and waive a parking charge. What should happen first?',
    [
      'Acknowledge the failure, secure the available room, and provide the authorized recovery promptly.',
      'Ask the guest to wait while the hotel completes a week-long investigation before changing rooms.',
      'Deny that the assignment occurred because a clean room is now available.',
      'Promise a remedy beyond the employee’s authority without contacting a supervisor.',
    ],
    0,
    'The immediate need is a safe, unoccupied room. Acknowledging the error and using an available, authorized remedy resolves that need promptly; the hotel can investigate the assignment failure afterward.',
    'foundational',
  ),
  authored(
    'hosp-recovery-2',
    'hosp-recovery',
    'A restaurant guest receives the wrong entrée. The requested dish can be prepared in twelve minutes, but the server is not authorized to promise a full party refund. Which response is strongest?',
    [
      'Apologize, replace the entrée promptly, explain the timing, and escalate any additional request appropriately.',
      'Promise every guest a full refund and hope a manager approves it after they leave.',
      'Tell the guest that empathy requires accepting the incorrect meal without a replacement.',
      'Remove the item from the menu permanently before resolving the guest’s current need.',
    ],
    0,
    'The response acknowledges the problem, provides a feasible immediate solution, communicates honestly, and respects authorization limits. Unsupported promises can create a second service failure.',
    'intermediate',
  ),
  authored(
    'hosp-capacity-1',
    'hosp-capacity',
    'A 100-room property is comparing two forecasts for one night. Plan A expects 80 occupied rooms at $150 each. Plan B expects 95 occupied rooms at $130 each. Before considering variable service costs, which plan produces more room revenue?',
    [
      'Plan B by $350.',
      'Plan A by $2,000.',
      'Plan A by $350.',
      'Both plans produce $12,000.',
    ],
    0,
    'Plan A produces 80 × $150 = $12,000. Plan B produces 95 × $130 = $12,350, which is $350 more. Profit analysis would also need the different service costs and guest mix.',
    'intermediate',
  ),
  authored(
    'hosp-capacity-2',
    'hosp-capacity',
    'A small hotel is considering accepting reservations beyond physical capacity for a holiday weekend. What information is most relevant before choosing an overbooking level?',
    [
      'Relevant cancellation and no-show patterns plus the cost and guest impact of relocating someone.',
      'The number of rooms the hotel wishes it had, without any cancellation history.',
      'The average temperature from an unrelated month in a different destination.',
      'A guarantee that every reservation will cancel at exactly the historical average.',
    ],
    0,
    'Overbooking balances expected unused capacity against the risk and cost of being unable to honor a reservation. Relevant patterns and a realistic recovery impact are necessary; an average is not a guarantee.',
    'advanced',
  ),
  authored(
    'hosp-safety-1',
    'hosp-safety',
    'A guest reports a severe nut allergy, and a server is unsure whether a sauce shares preparation equipment with a nut-containing item. What is the safest immediate response?',
    [
      'Pause the order and verify through established kitchen and allergy procedures before serving it.',
      'Guess that the sauce is safe because nuts are not visible on the plate.',
      'Remove the garnish and claim that all cross-contact risk has been eliminated.',
      'Ask another guest at the table to decide whether the risk is acceptable.',
    ],
    0,
    'Uncertainty about a serious allergen requires accurate verification and escalation through the established procedure. Appearance, guesses, and unauthorized assurances do not control possible cross-contact.',
    'foundational',
  ),
  authored(
    'hosp-safety-2',
    'hosp-safety',
    'A drink spills across a busy walkway near a restaurant entrance. A host notices it while several guests are approaching. What sequence best prioritizes safety?',
    [
      'Guard or isolate the area, request cleanup using procedure, and reopen it after the hazard is removed.',
      'Finish seating every arriving guest, then mention the spill at the end of the shift.',
      'Place a menu over the liquid so guests cannot see it and continue normal traffic.',
      'Wait for someone to slip before deciding whether the spill presents a real hazard.',
    ],
    0,
    'The immediate hazard should be controlled before routine service continues. Isolating the area prevents exposure while the proper cleanup occurs, and reopening should follow confirmation that the risk is removed.',
    'foundational',
  ),
  authored(
    'hosp-quality-1',
    'hosp-quality',
    'A resort’s average check-in time meets its eight-minute standard, but guest comments describe long waits after 8 p.m. Which analysis would best test whether the average is hiding inconsistent service?',
    [
      'Compare check-in time and queue length by shift and time period.',
      'Delete evening comments because the overall average already meets the standard.',
      'Measure the landscaping budget without linking it to check-in operations.',
      'Combine all service stages into one annual total so timing differences disappear.',
    ],
    0,
    'Segmenting the operating evidence can reveal whether evening performance differs from the overall result. An acceptable average can conceal a recurring service failure concentrated in one shift or stage.',
    'intermediate',
  ),
  authored(
    'hosp-quality-2',
    'hosp-quality',
    'Rooms are repeatedly released late even though final inspection takes only five minutes. Records show that housekeeping often waits thirty minutes for maintenance confirmation before inspection can start. What should management investigate first?',
    [
      'The maintenance-to-housekeeping handoff that delays the start of inspection.',
      'The inspection’s five-minute duration, because the final step must always be the root cause.',
      'The hotel’s logo design, because branding affects every operational result.',
      'Whether guests can be persuaded that the published check-in time is unimportant.',
    ],
    0,
    'The long wait occurs before inspection and points to a handoff problem. Reducing the short inspection itself would not address the thirty-minute delay that is driving late room release.',
    'intermediate',
  ),
  authored(
    'hosp-revenue-1',
    'hosp-revenue',
    'A tour has 40 seats. Option A sells 30 seats at $80 with a $20 variable cost per guest. Option B sells all 40 seats at $65 with the same variable cost. Ignoring fixed costs, which option produces greater contribution?',
    [
      'Neither; both options produce $1,800.',
      'Option A by $450.',
      'Option A by $300.',
      'Both options produce $2,400.',
    ],
    0,
    'Option A contributes ($80 − $20) × 30 = $1,800. Option B contributes ($65 − $20) × 40 = $1,800, so neither is greater. Other service or guest-mix effects could still influence the final decision.',
    'advanced',
  ),
  authored(
    'hosp-revenue-2',
    'hosp-revenue',
    'A weekend package adds $90 to a room price and includes services costing the hotel $35 per occupied package. If the package does not displace another sale, what incremental contribution does each package generate?',
    [
      '$55',
      '$35',
      '$90',
      '$125',
    ],
    0,
    'Incremental contribution is the additional package revenue minus its variable service cost: $90 − $35 = $55. Occupancy alone would not show this contribution.',
    'foundational',
  ),
  authored(
    'hosp-itinerary-1',
    'hosp-itinerary',
    'A traveler who uses a wheelchair wants to visit an attraction that closes at 4 p.m. The accessible shuttle arrives at 2:45 p.m., and the ride plus entry process takes 55 minutes. What should the planner recognize?',
    [
      'The plan leaves only twenty minutes before closing and may not provide a workable visit.',
      'Accessibility can be ignored because the attraction is open when the shuttle departs.',
      'Travel and entry time should be counted only after the attraction closes.',
      'The traveler’s stated transportation need is optional if another attraction is more popular.',
    ],
    0,
    'Arrival would be about 3:40 p.m., leaving very little usable time. A feasible itinerary must include travel, entry, operating hours, and the traveler’s accessibility requirement rather than listing an attraction alone.',
    'intermediate',
  ),
  authored(
    'hosp-itinerary-2',
    'hosp-itinerary',
    'An airport transfer normally takes 45 minutes, but traffic frequently adds 20 minutes. A group must arrive by 6:00 p.m. for a fixed check-in deadline. Which departure plan best manages the known risk?',
    [
      'Schedule at least the expected travel time plus a reasonable contingency before 6:00 p.m.',
      'Leave at 5:15 p.m. because the normal travel time is guaranteed on every trip.',
      'Ignore the check-in deadline and let the driver choose a departure after arrival time.',
      'Remove transportation from the itinerary so a late arrival is not recorded.',
    ],
    0,
    'A fixed deadline and recurring delay require contingency time. Planning only for the fastest ordinary trip leaves no protection against a known source of disruption.',
    'foundational',
  ),

  authored(
    'ent-customer-1',
    'ent-customer',
    'A founder interviews twenty people who say a meal-planning idea sounds interesting. Only one accepts an invitation to test a manual version, and nobody places a refundable preorder. What is the strongest interpretation?',
    [
      'General interest is weak evidence; observed participation and purchase behavior do not yet support demand.',
      'The compliments prove that the venture can scale without any additional customer evidence.',
      'The lack of preorders proves that no customer will ever have the underlying problem.',
      'The founder should count each positive adjective as a separate completed sale.',
    ],
    0,
    'Polite statements of interest can differ from behavior that requires time or money. The low test participation and absent preorders suggest the demand assumption needs further investigation rather than confirmation.',
    'intermediate',
  ),
  authored(
    'ent-customer-2',
    'ent-customer',
    'A founder wants to understand how independent tutors currently manage cancellations. Which interview question is least likely to steer respondents toward the founder’s proposed scheduling app?',
    [
      '“Walk me through the last cancellation you handled and what you did next.”',
      '“Wouldn’t an automated scheduling app solve your cancellation problem?”',
      '“How much do you love the reminder feature we plan to build?”',
      '“Do you agree that manual scheduling is always inefficient?”',
    ],
    0,
    'Asking about a recent real event invites behavioral evidence without assuming the problem or solution. The other questions reveal the preferred answer and may produce agreement rather than useful discovery.',
    'foundational',
  ),
  authored(
    'ent-model-1',
    'ent-model',
    'A startup says, “Small property managers can verify repair completion from one mobile photo log instead of coordinating multiple calls.” Which business-model element does this statement primarily describe?',
    [
      'The value proposition offered to a defined customer group.',
      'The complete revenue calculation after every operating cost.',
      'The legal ownership percentage assigned to each founder.',
      'The final list of all vendors the startup will ever use.',
    ],
    0,
    'The statement identifies a target user, a problem, and the promised benefit of the offering. It does not explain how money is earned, how ownership is divided, or every activity needed to deliver the value.',
    'foundational',
  ),
  authored(
    'ent-model-2',
    'ent-model',
    'A subscription company promises same-day delivery but owns no vehicles and has no dispatch capability. Which business-model question is most urgent?',
    [
      'Which key activity or partner will provide the delivery capability required by the promise?',
      'Which font should appear on invoices after the service is already operating?',
      'How can the company describe revenue without identifying any paying customer?',
      'How can the founders avoid estimating delivery cost in the business model?',
    ],
    0,
    'The value promise depends on an operating capability the company does not possess. A credible model must identify the activities, resources, or partners that can deliver the promise and the related cost.',
    'intermediate',
  ),
  authored(
    'ent-unit-1',
    'ent-unit',
    'A venture earns $42 for each kit sold and incurs $18 for materials, $6 for packaging, and $4 in transaction and delivery costs per kit. What is the unit contribution before fixed costs?',
    [
      '$14',
      '$18',
      '$24',
      '$70',
    ],
    0,
    'Variable unit cost is $18 + $6 + $4 = $28. Subtracting that amount from $42 of unit revenue leaves a $14 contribution toward fixed costs and profit.',
    'foundational',
  ),
  authored(
    'ent-unit-2',
    'ent-unit',
    'An online service receives $9 per transaction but pays $11 in transaction-specific support and processing cost. Fixed costs are unchanged. What happens if it rapidly increases volume under these economics?',
    [
      'Each additional transaction adds a $2 loss, so growth worsens the total loss before other changes.',
      'Volume automatically makes the negative unit contribution positive without any cost or price change.',
      'The service breaks even on every transaction because revenue is greater than zero.',
      'Fixed costs disappear as soon as the service processes a second transaction.',
    ],
    0,
    'Unit contribution is $9 − $11 = −$2. Scaling a negative contribution adds more loss with each transaction, so the venture should address price, variable cost, or customer economics before accelerating volume.',
    'intermediate',
  ),
  authored(
    'ent-funding-1',
    'ent-funding',
    'A founder compares a bank loan requiring monthly repayment with an equity investment requiring a 20% ownership stake. Which tradeoff is stated accurately?',
    [
      'Debt preserves ownership but creates repayment obligations; equity reduces ownership but lacks scheduled loan payments.',
      'Debt never needs repayment, while equity guarantees the founder retains complete control.',
      'Both options have identical effects on cash, ownership, control, and risk.',
      'Equity is a customer payment that must be refunded with interest every month.',
    ],
    0,
    'The loan can preserve the founder’s ownership but creates required payments and possible lending conditions. Equity normally does not require scheduled repayment, but the investor receives ownership and potentially influence.',
    'foundational',
  ),
  authored(
    'ent-funding-2',
    'ent-funding',
    'A profitable side business can fund a limited pilot from operating cash, but doing so will make expansion slower than accepting an outside investor. Why might the founder still choose bootstrapping?',
    [
      'It can preserve ownership and control while limiting the venture to available internal resources.',
      'It guarantees faster growth and unlimited cash in every possible situation.',
      'It transfers all business risk to customers without affecting the founder.',
      'It eliminates the need to monitor cash because internally generated money has no opportunity cost.',
    ],
    0,
    'Bootstrapping can protect ownership and decision control, but available cash may constrain speed and scope. It does not remove risk or the need for disciplined cash planning.',
    'intermediate',
  ),
  authored(
    'ent-experiment-1',
    'ent-experiment',
    'A founder believes local offices will pay for weekly plant care. Before running a two-week landing-page test, which decision rule would make the experiment more useful?',
    [
      'Set a minimum number or rate of qualified booking commitments that will justify the next test.',
      'Promise to continue regardless of the result so the founder cannot be disappointed.',
      'Change the success measure after seeing the data until the experiment appears positive.',
      'Measure page color preferences without collecting any evidence about willingness to book.',
    ],
    0,
    'A preselected threshold connects evidence to a next decision and reduces the temptation to reinterpret weak results. The measure should test the risky demand assumption rather than an unrelated design preference.',
    'intermediate',
  ),
  authored(
    'ent-experiment-2',
    'ent-experiment',
    'A team is uncertain whether customers value a proposed weekly analytics report. Which experiment gathers relevant learning with the least unnecessary development?',
    [
      'Manually create the report for a small test group and measure use and renewal interest.',
      'Build a complete automated reporting platform before any customer sees an example.',
      'Ask only the engineering team whether customers will pay for the finished platform.',
      'Purchase office furniture because a professional workspace guarantees product demand.',
    ],
    0,
    'A manual test exposes customers to the proposed value without funding the entire system first. Their use and follow-up behavior can inform whether deeper automation is justified.',
    'foundational',
  ),
  authored(
    'ent-growth-1',
    'ent-growth',
    'A wholesale startup doubles monthly orders, pays suppliers when goods ship, and collects from customers 45 days later. Which growth risk should its forecast highlight?',
    [
      'Working-capital needs may rise before cash from the additional sales is collected.',
      'Faster sales guarantee that supplier payments will be delayed by the same 45 days.',
      'Revenue growth automatically removes every need for inventory and staffing capacity.',
      'The collection delay matters only if the startup stops making sales entirely.',
    ],
    0,
    'The company pays for growth before receiving the related customer cash. More orders can therefore widen the temporary funding requirement even if the sales are profitable.',
    'intermediate',
  ),
  authored(
    'ent-growth-2',
    'ent-growth',
    'A food startup plans a national promotion after one successful local week. Production is already at 92% of capacity, and quality checks are occasionally skipped during peaks. What should happen before accelerating demand?',
    [
      'Build a capacity and quality plan with thresholds that trigger staffing, equipment, or promotion changes.',
      'Run the promotion immediately because demand growth automatically expands safe production capacity.',
      'Remove quality checks permanently so every order can leave the facility faster.',
      'Assume the successful week proves that downside scenarios no longer need to be forecast.',
    ],
    0,
    'Demand should not outpace the venture’s ability to deliver safely and consistently. Capacity, staffing, quality controls, downside assumptions, and clear trigger points should be addressed before a national push.',
    'advanced',
  ),
]

const organizationPrefixes = [
  'Alder', 'Beacon', 'Cedar', 'Driftwood', 'Elm', 'Foxglove', 'Granite', 'Harbor', 'Juniper', 'Keystone',
  'Lakeside', 'Meadow', 'Northstar', 'Oakline', 'Pioneer', 'Quartz', 'Riverbend', 'Summit', 'Timber', 'Willow',
] as const

const organizationSuffixes = [
  'Collective', 'Company', 'Group', 'Partners', 'Studio', 'Works', 'Services', 'Ventures', 'Market', 'Labs',
] as const

const roles = ['analyst', 'coordinator', 'specialist', 'associate', 'supervisor', 'planner', 'representative'] as const

const indefiniteArticle = (value: string) => /^[aeiou]/i.test(value) ? 'an' : 'a'

function organizationName(index: number): string {
  const prefix = organizationPrefixes[index % organizationPrefixes.length]
  const suffix = organizationSuffixes[Math.floor(index / organizationPrefixes.length) % organizationSuffixes.length]
  return `${prefix} ${suffix}`
}

function generated(
  blueprintId: string,
  index: number,
  text: string,
  answers: [string, string, string, string],
  explanation: string,
  difficulty: PracticeQuestionDifficulty = 'intermediate',
): AuthoredPracticeQuestion {
  return authored(
    `variant-${blueprintId}-${String(index + 1).padStart(3, '0')}`,
    blueprintId,
    text,
    answers,
    0,
    explanation,
    difficulty,
  )
}

function buildQuestionVariant(blueprintId: string, index: number): AuthoredPracticeQuestion {
  const organization = organizationName(index)
  const role = roles[index % roles.length]

  switch (blueprintId) {
    case 'mgmt-delegation': {
      const deadline = 2 + (index % 8)
      return generated(
        blueprintId,
        index,
        `${organization} assigns ${indefiniteArticle(role)} ${role} a client-summary task due in ${deadline} days. The employee has capacity and relevant software skills but has not completed this exact deliverable before. Which delegation plan gives useful ownership while protecting the result?`,
        [
          'Define the outcome, authority, resources, deadline, and a proportionate review point.',
          'Transfer all accountability to the employee and avoid every check-in until the deadline.',
          'Complete the entire assignment personally because unfamiliar work can never be delegated.',
          'Add unrelated assignments so the employee has no unused capacity during the project.',
        ],
        'Clear outcomes, authority, resources, and review points support the employee without removing ownership. The manager remains accountable for work completed through delegation.',
      )
    }
    case 'mgmt-operations': {
      const first = 22 + (index % 9)
      const bottleneck = 9 + (index % 6)
      const third = 19 + (index % 8)
      return generated(
        blueprintId,
        index,
        `${organization} processes requests through intake, review, and release. The stages can handle ${first}, ${bottleneck}, and ${third} requests per hour respectively, while demand is ${bottleneck + 5} per hour. Where should management first investigate added capacity to improve total throughput?`,
        [
          'The review stage, because it is the lowest-capacity constraint in the process.',
          'The intake stage, because improving the first step always raises total output.',
          'The release stage, because the last step is automatically the bottleneck.',
          'All stages equally, without considering their capacities or queue behavior.',
        ],
        `Review limits the process to ${bottleneck} requests per hour. Raising capacity at a non-bottleneck would not increase end-to-end throughput while review remains constrained.`,
      )
    }
    case 'mgmt-projects': {
      const delay = 1 + (index % 6)
      return generated(
        blueprintId,
        index,
        `${organization} must finish a data conversion before system testing can begin. Conversion is ${delay} days late, while an unrelated presentation design is also unfinished. Which task should the project lead prioritize to protect the dependent schedule?`,
        [
          'Complete or recover the data conversion because system testing depends on it.',
          'Finish the presentation design because visible work should always outrank dependencies.',
          'Start final testing without converted data so the calendar appears unchanged.',
          'Add new features while both scheduled tasks remain incomplete.',
        ],
        'The conversion is a prerequisite for testing and therefore affects downstream work. Unrelated design activity and new scope do not remove that schedule constraint.',
      )
    }
    case 'mgmt-hr': {
      const submissions = 2 + (index % 5)
      return generated(
        blueprintId,
        index,
        `A new ${organization} employee has submitted ${submissions} records in inconsistent formats. The supervisor discovers that training never defined the required format or supplied an example. What is the fairest first response to this performance gap?`,
        [
          'Clarify and demonstrate the standard, provide an example, and review the next submission.',
          'Issue a final warning because employees must infer every undocumented expectation.',
          'Remove the standard permanently so every possible format becomes acceptable.',
          'Transfer the employee without discussing the observable work requirement.',
        ],
        'The available evidence indicates an unclear expectation rather than misconduct. Management should make the standard observable, provide support, and then reassess performance.',
      )
    }
    case 'mgmt-ethics': {
      return generated(
        blueprintId,
        index,
        `A ${organization} purchasing ${role} is asked to score several bids and recognizes that one supplier is owned by a close relative. The relationship has not been disclosed. Which response makes the selection process most defensible?`,
        [
          'Disclose the conflict and follow the organization’s recusal or independent-review process.',
          'Score the related supplier secretly and disclose the relationship only after a winner is named.',
          'Automatically reject the relative’s bid without applying the published selection criteria.',
          'Give the related supplier extra points because personal trust reduces the need for review.',
        ],
        'Disclosure and independent handling manage both actual bias and the appearance of bias. Secret or deliberately distorted scoring would not apply standards consistently.',
      )
    }
    case 'mgmt-data': {
      const morning = 2 + (index % 4)
      const afternoon = 11 + (index % 7)
      return generated(
        blueprintId,
        index,
        `${organization} reports an overall customer wait near ${Math.round((morning + afternoon) / 2)} minutes. Morning waits average ${morning} minutes, afternoon waits average ${afternoon}, and afternoon complaints are rising. Which information should management examine next?`,
        [
          'Wait-time distributions by time period and service stage instead of the overall average alone.',
          'Only the overall average, because variation cannot affect an operating decision.',
          'An unrelated annual revenue total with no service-timing detail.',
          'The number of words in each complaint without identifying when delays occur.',
        ],
        'The overall average conceals a meaningful difference by time period. Segmenting timely, relevant operating data can reveal where the delay occurs and guide a response.',
      )
    }

    case 'mkt-segmentation': {
      const weeks = 3 + (index % 9)
      return generated(
        blueprintId,
        index,
        `${organization} can identify customers who reorder a consumable product every ${weeks} weeks, reach them through its account portal, and measure retention. Why is this group more actionable than “people who enjoy convenient products”?`,
        [
          'It is measurable, reachable, and based on behavior that can support a distinct offer.',
          'It includes every possible buyer, eliminating the need to choose a target market.',
          'It is based only on an unobservable attitude with no relationship to customer behavior.',
          'It guarantees that every customer will buy the same quantity at the same price.',
        ],
        'Observed reorder behavior defines a group the company can measure and reach with a relevant offer. A broad attitude alone does not create the same actionable distinction.',
      )
    }
    case 'mkt-research': {
      return generated(
        blueprintId,
        index,
        `${organization} wants to understand why customers cancel. Its draft survey asks, “How much did our inconvenient service hours cause you to leave?” What change would most improve the usefulness of the evidence?`,
        [
          'Use neutral wording that permits multiple possible cancellation reasons.',
          'Survey only current employees because they already know the intended answer.',
          'Contact only customers who renewed so the sample excludes cancellations.',
          'Remove every open response so unexpected causes cannot be reported.',
        ],
        'The draft assumes a cause and may lead respondents toward it. Neutral questions aimed at the relevant former-customer population better support the business decision.',
      )
    }
    case 'mkt-pricing': {
      const price = 55 + (index % 71)
      const variableCost = 18 + (index % 23)
      const contribution = price - variableCost
      return generated(
        blueprintId,
        index,
        `${organization} sells a service package for $${price} and incurs $${variableCost} in payment, materials, and delivery costs for each package. Fixed platform cost does not change with one additional sale. What is the contribution per package?`,
        [
          `$${contribution}`,
          `$${contribution + 5}`,
          `$${contribution + 12}`,
          `$${price + variableCost}`,
        ],
        `Unit contribution equals selling price minus variable unit cost. The calculation is $${price} − $${variableCost} = $${contribution}, which is available for fixed cost and profit.`,
        'foundational',
      )
    }
    case 'mkt-promotion': {
      const days = 7 + (index % 24)
      return generated(
        blueprintId,
        index,
        `${organization} launches a ${days}-day campaign whose immediate objective is increasing awareness among a defined local audience before enrollment opens. Which measure is most closely aligned with that objective?`,
        [
          'Change in aided and unaided awareness within the intended audience.',
          'Annual company payroll across departments unrelated to the campaign.',
          'Completed enrollments recorded before the enrollment system opens.',
          'The advertising agency’s average employee tenure.',
        ],
        'Audience awareness directly measures the stated early-stage objective. Enrollment is a later outcome, while payroll and agency tenure do not show whether recognition changed.',
      )
    }
    case 'mkt-channels': {
      return generated(
        blueprintId,
        index,
        `${organization} is comparing sales through its own website with sales through regional distributors. It values direct customer feedback but lacks local delivery capability. Which comparison is most relevant?`,
        [
          'Direct selling offers greater customer control, while distributors may add logistics and reach.',
          'Direct selling removes all fulfillment work, while distributors eliminate access to customers.',
          'Both choices always provide identical control, cost, service, and market coverage.',
          'Distributors are useful only when a producer plans to stop selling its product.',
        ],
        'A direct channel can strengthen control and feedback, while an intermediary can add capabilities such as regional delivery, assortment, or local knowledge.',
      )
    }
    case 'mkt-customer': {
      const lateRate = 12 + (index % 29)
      return generated(
        blueprintId,
        index,
        `${organization} sees customer cancellations rise after its late-delivery rate reaches ${lateRate}%. Support proposes sending every departing customer a discount while delivery operations remain unchanged. What is the stronger retention response?`,
        [
          'Correct the recurring delivery failure and use proportionate recovery for affected customers.',
          'Increase advertising impressions without measuring delivery reliability.',
          'Hide cancellation reasons so reports contain fewer service complaints.',
          'Offer larger discounts indefinitely while accepting the same failure rate.',
        ],
        'Retention efforts should address the demonstrated cause of dissatisfaction. A discount may provide recovery, but it does not correct the operational failure driving future churn.',
      )
    }

    case 'fin-statements': {
      const amount = 3000 + (index * 37)
      return generated(
        blueprintId,
        index,
        `${organization} completes $${amount} of client work in the final week of a month and invoices the customer for payment the following month. Under accrual accounting, which result can occur in the month the work is completed?`,
        [
          'Revenue and profit can increase before the related cash is collected.',
          'Cash must increase by the invoiced amount on the same day the invoice is issued.',
          'The completed work cannot affect any statement until the customer pays.',
          'Issuing the invoice automatically reduces both revenue and accounts receivable.',
        ],
        'Completed work can be recognized as revenue with a receivable even though cash collection occurs later. That timing difference helps explain why profit and cash flow can diverge.',
      )
    }
    case 'fin-cash': {
      const collectionDays = 30 + (index % 61)
      return generated(
        blueprintId,
        index,
        `${organization} reports a profit, but most customers pay ${collectionDays} days after purchase and the company has prepaid for inventory needed next month. Why can the business still experience a cash shortage?`,
        [
          'Cash is committed to receivables and inventory before customer collections arrive.',
          'A profitable company is prohibited from retaining cash during a growth period.',
          'Credit sales always reduce reported revenue until every invoice is collected.',
          'Inventory payments automatically produce matching cash receipts from suppliers.',
        ],
        'Accounting profit and cash use different timing. Receivables and inventory can absorb cash before customers pay, so profitable activity can still create a short-term funding need.',
      )
    }
    case 'fin-break-even': {
      const breakEvenUnits = 120 + index
      const contribution = 12 + (index % 17)
      const variableCost = 20 + (index % 11)
      const price = variableCost + contribution
      const fixedCost = breakEvenUnits * contribution
      return generated(
        blueprintId,
        index,
        `${organization} has $${fixedCost} in fixed launch costs, charges $${price} per unit, and incurs $${variableCost} in variable cost per unit. How many units must it sell to break even?`,
        [
          `${breakEvenUnits} units`,
          `${breakEvenUnits + 10} units`,
          `${breakEvenUnits + contribution} units`,
          `${breakEvenUnits * 2} units`,
        ],
        `Contribution is $${price} − $${variableCost} = $${contribution} per unit. Dividing $${fixedCost} of fixed cost by $${contribution} produces ${breakEvenUnits} break-even units.`,
        'intermediate',
      )
    }
    case 'fin-credit': {
      const interestA = 600 + (index * 3)
      const feeA = 75 + (index % 41)
      const totalA = interestA + feeA
      const difference = 80 + (index % 37)
      const totalB = totalA + difference
      return generated(
        blueprintId,
        index,
        `${organization} compares two loans for the same amount and term. Offer A charges $${interestA} interest plus a $${feeA} fee. Offer B has no fee but charges $${totalB} interest. Assuming no other differences, which offer has the lower stated borrowing cost?`,
        [
          `Offer A, by $${difference}.`,
          `Offer B, by $${difference}.`,
          `The offers cost the same because fees should be ignored.`,
          `Offer A, by $${totalA}.`,
        ],
        `Offer A costs $${interestA} + $${feeA} = $${totalA}. Offer B costs $${totalB}, so Offer A is lower by $${difference}. Fees and interest both affect total borrowing cost.`,
      )
    }
    case 'fin-investment': {
      const months = 3 + (index % 21)
      return generated(
        blueprintId,
        index,
        `A ${organization} client expects to need a reserve within ${months} months and cannot tolerate a large loss of principal. Which characteristics should receive the greatest weight when selecting where to hold the money?`,
        [
          'Liquidity and stability appropriate to the client’s short time horizon.',
          'Maximum possible long-term return regardless of short-term price movement.',
          'Concentration in one volatile holding so the account is simple to view.',
          'A withdrawal restriction that blocks access during the stated need period.',
        ],
        'A near-term reserve should be readily accessible and reasonably stable. A volatile or inaccessible choice conflicts with the stated horizon and loss tolerance.',
      )
    }
    case 'fin-controls': {
      return generated(
        blueprintId,
        index,
        `At ${organization}, one ${role} can create suppliers, approve invoices, release payments, and edit the accounting record. Which control most directly reduces the risk created by this combination?`,
        [
          'Separate supplier setup, payment authorization, and recordkeeping among appropriate people.',
          'Give the employee an additional password that unlocks every task more quickly.',
          'Stop documenting supplier changes so no record can be reviewed later.',
          'Let every employee release payments without approval during busy periods.',
        ],
        'Separating authorization, payment capability, and recordkeeping makes concealed error or misuse harder. Broader access and weaker documentation would increase the risk.',
      )
    }

    case 'hosp-recovery': {
      const minutes = 8 + (index % 23)
      return generated(
        blueprintId,
        index,
        `${organization} serves a guest the wrong meal. The requested replacement can be prepared in ${minutes} minutes, but the server cannot authorize a full-party refund. Which response best resolves the immediate failure without creating an unsupported promise?`,
        [
          'Apologize, replace the meal promptly, explain the timing, and escalate additional requests appropriately.',
          'Promise every guest a full refund and seek authorization only after they leave.',
          'Tell the guest that empathy requires accepting the incorrect meal.',
          'Investigate the entire menu before addressing the guest’s current need.',
        ],
        'Effective recovery acknowledges the failure, resolves the immediate need, communicates realistically, and respects authority limits. Unsupported promises can create another service failure.',
      )
    }
    case 'hosp-capacity': {
      const roomsA = 60 + (index % 20)
      const priceA = 150
      const roomsB = roomsA + 10
      const priceB = 145
      const revenueA = roomsA * priceA
      const revenueB = roomsB * priceB
      const difference = revenueB - revenueA
      return generated(
        blueprintId,
        index,
        `${organization} compares two room forecasts. Plan A expects ${roomsA} occupied rooms at $${priceA}; Plan B expects ${roomsB} occupied rooms at $${priceB}. Before variable service costs, which plan produces more room revenue?`,
        [
          `Plan B by $${difference}.`,
          `Plan A by $${difference}.`,
          `Both plans produce $${revenueA}.`,
          `Plan B by $${revenueB}.`,
        ],
        `Plan A produces $${revenueA}; Plan B produces $${revenueB}. Plan B is higher by $${difference}, although a profit decision would also consider service cost and guest mix.`,
        'intermediate',
      )
    }
    case 'hosp-safety': {
      return generated(
        blueprintId,
        index,
        `A guest at ${organization} reports a severe food allergy, and the server is unsure whether a sauce shares preparation equipment with the allergen. What is the safest immediate response?`,
        [
          'Pause the order and verify through established kitchen and allergy procedures before serving it.',
          'Guess that the sauce is safe because the allergen is not visible.',
          'Remove the garnish and promise that all cross-contact risk is gone.',
          'Ask another guest to decide whether the uncertainty is acceptable.',
        ],
        'Uncertainty about a serious allergen requires accurate verification and appropriate escalation. Appearance, guesses, and unsupported assurances do not control cross-contact risk.',
      )
    }
    case 'hosp-quality': {
      const overall = 6 + (index % 4)
      const evening = overall + 7 + (index % 6)
      return generated(
        blueprintId,
        index,
        `${organization} reports an average check-in time of ${overall} minutes, but guest comments describe waits near ${evening} minutes after 8 p.m. Which analysis would best test whether the average hides inconsistent service?`,
        [
          'Compare check-in time and queue length by shift and time period.',
          'Delete evening comments because the overall average is lower.',
          'Measure an unrelated landscaping expense without linking it to check-in.',
          'Combine every service stage into one annual total so timing differences disappear.',
        ],
        'Segmenting operating evidence by shift can reveal a recurring evening failure concealed by the overall average. The other measures do not diagnose check-in consistency.',
      )
    }
    case 'hosp-revenue': {
      const addedPrice = 50 + (index % 101)
      const addedCost = 15 + (index % 29)
      const contribution = addedPrice - addedCost
      return generated(
        blueprintId,
        index,
        `${organization} adds $${addedPrice} to a booking for an optional package that creates $${addedCost} in guest-specific service cost. If the package does not displace another sale, what incremental contribution does each package produce?`,
        [
          `$${contribution}`,
          `$${contribution + 5}`,
          `$${contribution + 12}`,
          `$${addedPrice + addedCost}`,
        ],
        `Incremental contribution is the added package revenue minus its variable service cost: $${addedPrice} − $${addedCost} = $${contribution}.`,
        'foundational',
      )
    }
    case 'hosp-itinerary': {
      const transfer = 35 + (index % 31)
      const delay = 10 + (index % 26)
      return generated(
        blueprintId,
        index,
        `${organization} plans an airport transfer that normally takes ${transfer} minutes, while recurring traffic can add ${delay} minutes. The group has a fixed check-in deadline. Which scheduling approach best manages the known risk?`,
        [
          'Allow the normal travel time plus a reasonable contingency before the fixed deadline.',
          'Use only the fastest recorded trip because normal travel time is guaranteed.',
          'Ignore the deadline and choose a departure after the required arrival time.',
          'Remove transportation from the itinerary so a late arrival is not documented.',
        ],
        'A feasible itinerary includes travel time, fixed operating constraints, and reasonable contingency for known disruption. Planning only for an ideal trip leaves the group exposed.',
      )
    }

    case 'ent-customer': {
      const interviews = 12 + (index % 39)
      const trials = 1 + (index % 4)
      return generated(
        blueprintId,
        index,
        `${organization} interviews ${interviews} potential customers who say an idea sounds interesting, but only ${trials} accept a free manual trial and nobody makes a refundable deposit. What is the strongest interpretation?`,
        [
          'General interest is weak evidence; participation and purchase behavior do not yet support demand.',
          'The compliments prove the venture can scale without additional customer evidence.',
          'The result proves that no customer will ever experience the underlying problem.',
          'Every positive adjective should be counted as a completed sale.',
        ],
        'Statements of interest can differ from behavior that requires time or money. Weak trial and deposit behavior means the demand assumption needs more testing rather than confirmation.',
      )
    }
    case 'ent-model': {
      return generated(
        blueprintId,
        index,
        `${organization} promises same-day delivery to small businesses but owns no vehicles and has no dispatch capability. Which business-model question is most urgent before making that promise to customers?`,
        [
          'Which key activity or partner will supply the required delivery capability?',
          'Which invoice font should be selected after the service is operating?',
          'How can revenue be described without identifying a paying customer?',
          'How can delivery cost be excluded from every forecast?',
        ],
        'The promised customer value depends on an operating capability the venture lacks. A credible model must identify the activity, resource, or partner that can deliver it and the related cost.',
      )
    }
    case 'ent-unit': {
      const price = 30 + (index % 71)
      const materials = 8 + (index % 16)
      const serviceCost = 3 + (index % 8)
      const contribution = price - materials - serviceCost
      return generated(
        blueprintId,
        index,
        `${organization} earns $${price} for each unit sold and incurs $${materials} in materials plus $${serviceCost} in transaction and fulfillment cost for that unit. What is unit contribution before fixed costs?`,
        [
          `$${contribution}`,
          `$${contribution + 3}`,
          `$${contribution + 9}`,
          `$${price + materials + serviceCost}`,
        ],
        `Variable unit cost is $${materials} + $${serviceCost} = $${materials + serviceCost}. Subtracting it from $${price} of unit revenue leaves $${contribution} in contribution.`,
        'foundational',
      )
    }
    case 'ent-funding': {
      const ownership = 10 + (index % 31)
      return generated(
        blueprintId,
        index,
        `${organization} compares a loan requiring scheduled repayment with an investment requiring a ${ownership}% ownership stake. Which tradeoff is described accurately?`,
        [
          'Debt preserves ownership but creates repayment obligations; equity reduces ownership without scheduled loan payments.',
          'Debt never needs repayment, while equity guarantees the founder retains complete control.',
          'Both choices always have identical effects on cash, control, ownership, and risk.',
          'Equity is a customer payment that must be refunded with interest each month.',
        ],
        'Debt generally creates repayment duties and may preserve ownership. Equity normally lacks scheduled loan repayment, but the investor receives ownership and potentially influence.',
      )
    }
    case 'ent-experiment': {
      const days = 7 + (index % 22)
      return generated(
        blueprintId,
        index,
        `${organization} plans a ${days}-day landing-page experiment to test whether local businesses will request a paid service. What should the team define before viewing the results?`,
        [
          'A minimum qualified commitment rate that determines whether to continue, change, or stop.',
          'A promise to continue regardless of the evidence so the original idea is protected.',
          'A success measure that can be changed after the data arrives until it appears positive.',
          'A page-color preference metric unrelated to willingness to request the service.',
        ],
        'A predefined decision rule connects evidence to action and reduces after-the-fact reinterpretation. The measure should directly test the risky demand assumption.',
      )
    }
    case 'ent-growth': {
      const collectionDays = 30 + (index % 61)
      const growth = 25 + (index % 76)
      return generated(
        blueprintId,
        index,
        `${organization} forecasts ${growth}% order growth, pays suppliers when goods ship, and collects from customers ${collectionDays} days later. Which risk should its growth plan address explicitly?`,
        [
          'Working-capital needs can increase before cash from the additional sales is collected.',
          'Sales growth guarantees suppliers will delay their payments by the same number of days.',
          'Higher demand automatically removes every inventory, quality, and staffing constraint.',
          'Collection timing matters only when the venture stops making sales.',
        ],
        'The venture must fund inventory and operations before receiving related customer cash. Growth can therefore widen the temporary funding need even when each sale is profitable.',
      )
    }
    default:
      throw new Error(`No practice-question variant builder for ${blueprintId}`)
  }
}

const categoryList: TestCategory[] = ['MANAGEMENT', 'MARKETING', 'FINANCE', 'HOSPITALITY', 'ENTREPRENEURSHIP']
const questionsPerCategory = 1_000

const generatedPracticeQuestions = categoryList.flatMap(category => {
  const categoryBlueprints = TEST_BLUEPRINTS.filter(blueprint => blueprint.category === category)
  const coreCount = CORE_PRACTICE_QUESTIONS.filter(
    question => categoryBlueprints.some(blueprint => blueprint.id === question.blueprintId),
  ).length
  return Array.from({ length: questionsPerCategory - coreCount }, (_, index) => {
    const blueprint = categoryBlueprints[index % categoryBlueprints.length]
    return buildQuestionVariant(blueprint.id, Math.floor(index / categoryBlueprints.length))
  })
})

export const PRACTICE_QUESTION_BANK: AuthoredPracticeQuestion[] = [
  ...CORE_PRACTICE_QUESTIONS,
  ...generatedPracticeQuestions,
]

const blueprintById = new Map(TEST_BLUEPRINTS.map(blueprint => [blueprint.id, blueprint]))

export function getAuthoredPracticeQuestions(category: TestCategory): AuthoredPracticeQuestion[] {
  return PRACTICE_QUESTION_BANK.filter(question => blueprintById.get(question.blueprintId)?.category === category)
}

export function getPracticeQuestionBlueprint(blueprintId: string) {
  return blueprintById.get(blueprintId)
}
