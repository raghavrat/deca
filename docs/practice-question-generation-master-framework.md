# Practice Question Generation Master Framework

Status: generation specification

Research snapshot: July 20, 2026

Applies to: original multiple-choice practice questions for Deca Pal

Legal posture: independent educational content; not legal advice; not an official, sponsored, licensed, or endorsed exam product

## 1. Purpose

This document defines how Deca Pal should author, validate, review, and publish an original practice-question bank that has the structure, scope, cognitive demand, and category balance of the current competitive-event exam program without copying, rewriting, reconstructing, or training on protected test items.

The main quality correction is architectural. A category name alone is not enough to generate a realistic test. The generator must first select the correct **exam family**, then the competition level, instructional-area quota, first-party learning objective, cognitive operation, question form, and difficulty. Only then may it draft the item.

This framework is intended to replace mass production from a small set of repeated templates. It does not authorize runtime generation. Questions should be generated in controlled batches, reviewed, versioned, materialized into a fixed bank, and served from that bank.

## 2. Non-negotiable copyright boundary

### 2.1 The clean-room rule

The drafting model, its prompt, its retrieval system, and its fine-tuning data must not receive:

- an official or released DECA or MBA Research question, answer set, answer key, rationale, source note, test number, or question screenshot;
- a DECA role-play, case study, judge instruction, or scenario as a seed for a test item;
- DECA+ content or content copied from a paid preparation product;
- unofficial reposts, flashcard exports, shared-drive files, Quizlet-style mirrors, or user-pasted exam questions;
- a request to rewrite, disguise, translate, shorten, modernize, or make variants of a protected item; or
- verbatim MBA Research performance-indicator statements unless a license explicitly permits this product and use.

The model receives only first-party learning objectives, independently written concept notes, approved formulas, general business facts, and the aggregate format rules in this document.

### 2.2 What the research may influence

Public official materials may be used to identify non-expressive facts and systems such as:

- the names and existence of exam families;
- the fact that an exam has 100 multiple-choice items and four options;
- instructional-area counts in an official blueprint;
- curriculum-planning levels;
- aggregate measurements such as stem-length distributions and the frequency of broad item forms; and
- the general fact that exams combine Business Administration Core content with cluster-specific content.

Official question wording, fictional facts, option sets, distractor logic from a particular item, explanations, and source citations may not be carried into the authoring prompt or first-party bank.

### 2.3 Product labeling

Every practice-test surface must state substantially the following:

> Original, independently authored practice content. Not an official DECA Inc. or MBA Research exam and not endorsed by either organization.

Do not market the bank as containing "actual," "released," "official," "real," or "previously used" questions. "Competition-prep practice" and "blueprint-aligned original practice" are safer descriptions, subject to counsel review.

DECA's published distribution policy says competitive scenarios may not be banked, reused to develop other scenarios, edited, rewritten, or posted outside the permitted use. This framework therefore requires a clean-room process even when a source is publicly accessible.

## 3. Research base

### 3.1 Primary sources

The specification is based on these official sources:

- [DECA 2026-2027 High School Competitive Events Exam Blueprint](https://www.deca.org/assets/hs-competitive-events-exam-blueprint)
- [DECA Competitive Events Exam Blueprints resource page](https://www.deca.org/advisor-resources/competitive-events-exam-blueprints)
- [MBA Research: DECA assessments and exam design](https://www.mbaresearch.org/local-educators/student-organizations/deca/)
- [MBA Research: National Business Administration Standards organization](https://www.mbaresearch.org/local-educators/teaching-resources/standards/)
- [DECA competitive-event catalog](https://www.deca.org/compete)
- [DECA Copyright + Integrity Agreement](https://www.deca.org/advisor-resources/competitive-events-district-instructional-areas)
- [CEE and Jump$tart 2021 National Standards for Personal Financial Education](https://www.councilforeconed.org/wp-content/uploads/2021/10/2021-National-Standards-for-Personal-Financial-Education.pdf)

MBA Research states that the exams are 100-item multiple-choice assessments, do not use true/false or combination-answer items, are designed for score discrimination, prorate items across eligible performance indicators, and include Business Administration Core items in cluster exams. It also states that most cluster exams use performance indicators through the Specialist level, Principles district/state exams use Prerequisite and Career Sustaining levels, and Entrepreneurship draws from all six curriculum-planning levels.

### 3.2 Current official sample set inspected

The research reviewed the current public sample linked from the official event page for each of the seven exam families:

1. [Business Administration Core sample](https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/69a1ed502b052b24e81259ae_BA%20Core-District%20Exam.pdf)
2. [Business Management and Administration sample](https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/69a1edebf57b826a8b7b652a_BMA-District%20Exam.pdf)
3. [Entrepreneurship sample](https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/69a1ee11b265a7940d828561_Entre-District%20Exam.pdf)
4. [Finance sample](https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/67c1d710e252d5f3c3e2087d_24-25_Finance%20District%20Exam.pdf)
5. [Hospitality and Tourism sample](https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/67c1d68ac7bf2c1ccdb27759_24-25_Hospitality%20District%20Exam.pdf)
6. [Marketing sample](https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/69a1eeab6e1e15a9025b6321_Marketing-District%20Exam.pdf)
7. [Personal Financial Literacy sample](https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/69a1ee31bd1b037f801c8b16_PFL-District%20Exam.pdf)

These files were examined only to compute aggregate structural measurements. No question text, option set, answer rationale, or official source note is reproduced in this document or approved for use in model context.

### 3.3 Aggregate sample measurements

The following measurements describe the 700 current public sample items. "Contextual" and "quantitative" are conservative keyword/length heuristics, so they are calibration signals rather than authoritative classifications.

| Exam family | Sample year | Median stem words | Middle 50% stem words | "Which of the following" | Contextual heuristic | Explicit quantitative signal | Stems of 40+ words |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Business Administration Core | 2026 | 16 | 12-25 | 26% | 45% | 9% | 7% |
| Business Management + Administration | 2026 | 17 | 12-26 | 24% | 47% | 9% | 15% |
| Entrepreneurship | 2026 | 18 | 12-23 | 26% | 54% | 9% | 8% |
| Finance | 2025 | 15 | 11-23 | 36% | 40% | 6% | 6% |
| Hospitality + Tourism | 2025 | 17 | 12-30 | 27% | 54% | 6% | 16% |
| Marketing | 2026 | 17.5 | 13-24 | 24% | 51% | 2% | 9% |
| Personal Financial Literacy | 2026 | 16 | 12-24 | 32% | 38% | 15% | 12% |

Across the samples, the median option was only two to four words. Roughly half of the stems were grammatically completed by an option rather than ending as a direct question. Negative or exception phrasing was rare, generally two to five items per 100. Correct-answer positions varied naturally; they were not forced to exactly 25 of each letter on every exam.

These findings identify several anti-patterns in a synthetic bank:

- making every item a long scenario;
- making every option a full paragraph;
- using the same question opening repeatedly;
- making every item a managerial "best next step" decision;
- forcing exactly balanced correct positions before answer shuffling;
- putting calculations into every Finance item; and
- changing only names and numbers across hundreds of variants.

## 4. Exam-family routing

The product must represent seven exam families, not five generic categories.

| Exam family ID | Used for | Current app relationship |
| --- | --- | --- |
| `BUSINESS_ADMIN_CORE` | Principles of Business Management and Administration, Entrepreneurship, Finance, Hospitality and Tourism, and Marketing | Missing as a distinct bank; do not substitute the Management bank |
| `BUSINESS_MANAGEMENT_ADMIN` | Business Law and Ethics Team Decision Making, Human Resources Management Series, and other events assigned this cluster exam | Maps to `MANAGEMENT` |
| `ENTREPRENEURSHIP` | Entrepreneurship Series and Entrepreneurship Team Decision Making | Maps to `ENTREPRENEURSHIP` |
| `FINANCE_CLUSTER` | Accounting Applications, Business Finance, Financial Services Team Decision Making, Financial Consulting, and other events assigned this cluster exam | Maps to `FINANCE` |
| `HOSPITALITY_TOURISM_CLUSTER` | Hospitality Services, Hotel and Lodging, Restaurant and Food Service, Quick Serve, Travel and Tourism, and related events | Maps to `HOSPITALITY` |
| `MARKETING_CLUSTER` | Marketing series, Marketing team events, integrated marketing campaigns, and Professional Selling | Maps to `MARKETING` |
| `PERSONAL_FINANCIAL_LITERACY` | Personal Financial Literacy | Missing; must not be folded into corporate Finance |

The selected competitive event should resolve to an exam-family ID before a practice set is assembled. An event's role-play instructional area does not replace the exam blueprint; official guidance distinguishes role-play indicators from written-exam selection.

### Bank-size correction

Five pools of 1,000 questions cover only the five current application categories. They cannot faithfully cover all seven written-exam families.

Recommended complete inventory:

- 1,000 Business Administration Core items;
- 1,000 Business Management and Administration items;
- 1,000 Entrepreneurship items;
- 1,000 Finance Cluster items;
- 1,000 Hospitality and Tourism Cluster items;
- 1,000 Marketing Cluster items; and
- 1,000 Personal Financial Literacy items.

That is a 7,000-item bank. If the product intentionally remains at 5,000, it must label the bank as cluster-category practice and must not claim full Principles or Personal Financial Literacy coverage.

## 5. Official 2026-2027 blueprint quotas

The following are target counts per 100-item test from the current official blueprint. Actual official counts may vary slightly. These counts are non-expressive allocation facts; they do not authorize use of protected performance-indicator language or test items.

The generator should author to the full bank's proportional targets. The test assembler should use the selected level column for 100-item simulations. Short quizzes should use a stratified sample and disclose that exact 100-item proportions are impossible at small sizes.

### 5.1 Business Administration Core

| Instructional area | District | Association | ICDC |
| --- | ---: | ---: | ---: |
| Business Law | 1 | 1 | 4 |
| Communications | 15 | 15 | 11 |
| Customer Relations | 5 | 5 | 4 |
| Economics | 7 | 7 | 12 |
| Emotional Intelligence | 22 | 22 | 19 |
| Entrepreneurship | 0 | 0 | 1 |
| Financial Analysis | 16 | 16 | 13 |
| Human Resources Management | 1 | 1 | 1 |
| Information Management | 10 | 10 | 11 |
| Marketing | 1 | 1 | 1 |
| Operations | 11 | 11 | 13 |
| Professional Development | 11 | 11 | 9 |
| Strategic Management | 0 | 0 | 1 |

### 5.2 Business Management and Administration

| Instructional area | District | Association | ICDC |
| --- | ---: | ---: | ---: |
| Business Law | 5 | 5 | 5 |
| Communications | 7 | 6 | 6 |
| Customer Relations | 2 | 2 | 1 |
| Economics | 6 | 5 | 4 |
| Emotional Intelligence | 9 | 8 | 6 |
| Entrepreneurship | 1 | 0 | 0 |
| Financial Analysis | 7 | 6 | 5 |
| Human Resources Management | 1 | 0 | 0 |
| Information Management | 7 | 6 | 6 |
| Knowledge Management | 6 | 7 | 8 |
| Marketing | 1 | 1 | 1 |
| Operations | 21 | 24 | 26 |
| Professional Development | 6 | 5 | 4 |
| Project Management | 6 | 7 | 8 |
| Quality Management | 3 | 4 | 5 |
| Risk Management | 4 | 5 | 5 |
| Strategic Management | 8 | 9 | 10 |

### 5.3 Entrepreneurship

| Instructional area | District | Association | ICDC |
| --- | ---: | ---: | ---: |
| Business Law | 4 | 4 | 3 |
| Channel Management | 3 | 3 | 3 |
| Communications | 1 | 0 | 1 |
| Customer Relations | 1 | 1 | 1 |
| Economics | 3 | 3 | 2 |
| Emotional Intelligence | 6 | 6 | 4 |
| Entrepreneurship | 14 | 13 | 14 |
| Financial Analysis | 10 | 9 | 11 |
| Human Resources Management | 5 | 4 | 4 |
| Information Management | 4 | 3 | 2 |
| Market Planning | 5 | 6 | 6 |
| Marketing | 1 | 1 | 1 |
| Marketing-Information Management | 2 | 3 | 2 |
| Operations | 13 | 13 | 14 |
| Pricing | 2 | 3 | 2 |
| Product/Service Management | 4 | 4 | 4 |
| Professional Development | 5 | 5 | 4 |
| Promotion | 6 | 7 | 8 |
| Quality Management | 1 | 1 | 1 |
| Risk Management | 2 | 3 | 4 |
| Selling | 1 | 1 | 1 |
| Strategic Management | 7 | 7 | 8 |

### 5.4 Finance Cluster

| Instructional area | District | Association | ICDC |
| --- | ---: | ---: | ---: |
| Business Law | 7 | 8 | 7 |
| Communications | 5 | 4 | 3 |
| Customer Relations | 5 | 5 | 4 |
| Economics | 6 | 5 | 4 |
| Emotional Intelligence | 9 | 8 | 6 |
| Entrepreneurship | 1 | 0 | 0 |
| Financial Analysis | 24 | 28 | 30 |
| Financial-Information Management | 9 | 10 | 12 |
| Human Resources Management | 1 | 0 | 0 |
| Information Management | 6 | 5 | 5 |
| Marketing | 1 | 1 | 1 |
| Operations | 6 | 5 | 4 |
| Professional Development | 13 | 14 | 15 |
| Risk Management | 6 | 7 | 9 |
| Strategic Management | 1 | 0 | 0 |

### 5.5 Hospitality and Tourism Cluster

| Instructional area | District | Association | ICDC |
| --- | ---: | ---: | ---: |
| Business Law | 3 | 3 | 2 |
| Communications | 5 | 4 | 3 |
| Customer Relations | 8 | 9 | 9 |
| Economics | 6 | 6 | 5 |
| Emotional Intelligence | 9 | 9 | 7 |
| Entrepreneurship | 1 | 0 | 0 |
| Financial Analysis | 8 | 7 | 7 |
| Human Resources Management | 2 | 1 | 1 |
| Information Management | 14 | 15 | 15 |
| Knowledge Management | 0 | 1 | 1 |
| Market Planning | 1 | 1 | 2 |
| Marketing | 1 | 1 | 2 |
| Operations | 13 | 13 | 13 |
| Pricing | 1 | 1 | 1 |
| Product/Service Management | 6 | 7 | 9 |
| Professional Development | 8 | 7 | 6 |
| Promotion | 2 | 3 | 3 |
| Quality Management | 1 | 1 | 1 |
| Risk Management | 1 | 1 | 2 |
| Selling | 7 | 8 | 9 |
| Strategic Management | 3 | 2 | 2 |

### 5.6 Marketing Cluster

| Instructional area | District | Association | ICDC |
| --- | ---: | ---: | ---: |
| Business Law | 2 | 2 | 1 |
| Channel Management | 5 | 6 | 7 |
| Communications | 5 | 4 | 3 |
| Customer Relations | 2 | 2 | 1 |
| Economics | 6 | 5 | 4 |
| Emotional Intelligence | 9 | 8 | 6 |
| Entrepreneurship | 1 | 0 | 0 |
| Financial Analysis | 6 | 5 | 4 |
| Human Resources Management | 1 | 0 | 0 |
| Information Management | 5 | 4 | 3 |
| Market Planning | 4 | 4 | 5 |
| Marketing | 1 | 1 | 1 |
| Marketing-Information Management | 11 | 14 | 16 |
| Operations | 6 | 5 | 4 |
| Pricing | 3 | 4 | 4 |
| Product/Service Management | 11 | 13 | 15 |
| Professional Development | 6 | 5 | 5 |
| Promotion | 9 | 11 | 13 |
| Selling | 6 | 7 | 8 |
| Strategic Management | 1 | 0 | 0 |

### 5.7 Personal Financial Literacy

| Topic | District | Association | ICDC |
| --- | ---: | ---: | ---: |
| Earning Income | 25 | 20 | 16 |
| Spending | 14 | 14 | 14 |
| Saving | 15 | 14 | 13 |
| Investing | 15 | 19 | 21 |
| Managing Credit | 16 | 19 | 21 |
| Managing Risk | 15 | 14 | 15 |

## 6. First-party objective architecture

The current 30 broad blueprints are too few for a high-quality 5,000-item bank. Producing approximately 167 variants from one broad blueprint creates obvious template families and weak coverage.

Create a first-party objective catalog with at least:

- 12-20 independently written objectives per instructional area with a nonzero quota;
- 250-400 objectives across the five current app categories;
- additional catalogs for Business Administration Core and Personal Financial Literacy if full seven-family coverage is implemented; and
- no more than 4-6 accepted items per objective in the initial bank unless the items use materially different facts, cognitive operations, and misconception models.

Each objective record should contain:

```json
{
  "objectiveId": "fin-analysis-cash-vs-profit-01",
  "examFamilies": ["FINANCE_CLUSTER"],
  "instructionalArea": "Financial Analysis",
  "firstPartyObjective": "Distinguish accounting profit from cash movement when transaction timing differs.",
  "conceptPacket": [
    "Credit sales can be recognized before cash is collected.",
    "Inventory and other operating needs can consume cash before related revenue is collected.",
    "A cash forecast focuses on the timing of receipts and payments."
  ],
  "approvedFormulas": [],
  "allowedCognitiveOperations": ["classify", "diagnose", "apply"],
  "forbiddenAmbiguities": [
    "Do not assume a payment date that is not stated.",
    "Do not equate positive profit with positive operating cash flow."
  ],
  "author": "internal-author-id",
  "reviewStatus": "approved",
  "rightsBasis": "first-party-authored"
}
```

The catalog may use general instructional-area labels to allocate content. The operative learning-objective sentence and concept notes must be independently authored and recorded in provenance history.

## 7. Item-plan contract

Generation must begin from an item plan, not a prose command such as "make 1,000 Finance questions."

```json
{
  "examFamily": "FINANCE_CLUSTER",
  "competitionLevel": "district",
  "instructionalArea": "Financial Analysis",
  "objectiveId": "fin-analysis-cash-vs-profit-01",
  "difficulty": "intermediate",
  "cognitiveOperation": "diagnose",
  "stemForm": "short_scenario",
  "contextDomain": "small_wholesaler",
  "numeracy": "none",
  "targetStemWords": [16, 30],
  "misconceptionTargets": [
    "profit always equals cash",
    "revenue requires immediate cash collection",
    "inventory purchases never affect cash"
  ],
  "seed": "bank-v2-fin-00421"
}
```

The planner is deterministic. It creates quota cells for exam family, instructional area, objective, difficulty, cognitive operation, stem form, and context. The drafting model fills one plan at a time or a small group of plans with different objectives.

## 8. Recommended item-form mix

The percentages below are Deca Pal authoring targets, not official published classifications. They are designed to reproduce the measured variety without reproducing expressive content.

| Item form | Principles/Core target | Cluster target | Entrepreneurship target | PFL target |
| --- | ---: | ---: | ---: | ---: |
| Direct concept distinction | 20-30% | 15-25% | 10-20% | 15-25% |
| Sentence completion/classification | 15-25% | 15-25% | 15-20% | 10-20% |
| Short workplace/customer scenario | 25-35% | 30-40% | 35-45% | 25-35% |
| Best decision under a stated constraint | 10-20% | 15-25% | 20-30% | 15-25% |
| Cause, effect, diagnosis, or evidence | 10-15% | 10-20% | 10-20% | 10-15% |
| One- or two-step quantitative item | 5-12% | family-dependent | 5-12% | 10-20% |
| Negative/exception stem | 0-4% | 0-5% | 0-4% | 0-4% |

Do not force every percentage in every small batch. Enforce it across at least 100 accepted items in an exam family.

### 8.1 Difficulty and cognition

Difficulty is not stem length. It comes from the closeness of distractors, number of facts that must be integrated, abstraction, and the complexity of the required judgment.

| Exam family | Foundational | Intermediate application | Advanced analysis |
| --- | ---: | ---: | ---: |
| Business Administration Core, district/association | 40% | 45% | 15% |
| Business Administration Core, ICDC | 30% | 50% | 20% |
| BMA, Finance, Hospitality, Marketing clusters | 25% | 50% | 25% |
| Entrepreneurship | 20% | 45% | 35% |
| Personal Financial Literacy | 30% | 50% | 20% |

These are internal calibration targets. Validate them with student response data and revise using item difficulty and discrimination statistics.

## 9. Stem construction rules

### 9.1 Length and variety

- Target a family median of 15-19 words.
- Keep roughly 60-75% of stems between 10 and 30 words.
- Permit a controlled 5-15% of stems over 40 words when multiple facts are necessary.
- Avoid decorative background facts. Every fact should affect the answer or make the workplace context intelligible.
- Use both direct questions and stems grammatically completed by the answer option.
- Keep "Which of the following" to approximately 20-35% by family; do not use it as the default opening.
- Use negative or exception wording sparingly. Emphasize the negative word typographically in the UI when used.
- Never use true/false, "A and B," "all of the above," "none of the above," or multiple-response formats.

### 9.2 Scenario design

A scenario must be independently invented from the selected context domain and objective. It should usually include:

1. an actor or organization;
2. one relevant goal or problem;
3. one or two decision-relevant facts; and
4. a request that tests the chosen objective.

Do not reuse a named organization, character pairing, unusual fact pattern, exact number set, or narrative structure from an official sample. Use broad context pools and rotate industries, organization size, customer type, channel, and role.

### 9.3 Language

- Use clear U.S. English at an accessible high-school reading level while retaining necessary business vocabulary.
- Prefer concrete verbs and short sentences.
- Do not use slang, jokes, memes, celebrity references, or brand names.
- Avoid unnecessary gender, race, disability, nationality, age, religion, or family-status details.
- Avoid stereotypes in occupation, financial behavior, customer behavior, or leadership ability.
- Use singular "they" where gender is irrelevant.
- Do not create a disability or protected trait as the cause of a workplace problem.

## 10. Answer and distractor engineering

### 10.1 Correct answer

The correct answer must:

- be completely supported by the stem and approved concept packet;
- remain correct without hidden assumptions;
- answer the exact grammatical and cognitive request;
- be defensible under ordinary business practice; and
- be uniquely better than all distractors.

For quantitative items, the generator must independently solve the item twice or use two equivalent methods. All required rates, time periods, conventions, and rounding rules must be stated.

### 10.2 Distractor taxonomy

Each distractor should represent a named, plausible error:

- **related-term confusion:** a neighboring concept that does not fit the stated facts;
- **reversed relationship:** cause/effect, debit/credit, risk/return, or sequence reversed;
- **right action, wrong timing:** a reasonable action performed before a prerequisite;
- **right metric, wrong objective:** a measure that does not match the decision;
- **partial calculation:** a common omitted step, wrong base, or wrong time period;
- **overgeneralization:** a rule applied beyond its conditions;
- **constraint violation:** an otherwise plausible answer that violates cost, authority, policy, safety, or customer requirements; or
- **symptom treatment:** addresses the visible symptom rather than the stated root cause.

Do not use absurd, unethical, illegal, or obviously unserious distractors unless identifying that defect is the learning objective. Do not make the correct option the longest, most specific, most qualified, or only professionally worded option.

### 10.3 Parallelism

- All four options must be the same grammatical type.
- Options should be comparable in specificity and length.
- Avoid overlapping answer scopes.
- Avoid clues from repeated stem words appearing only in the correct option.
- Avoid absolute words such as "always" and "never" unless the concept truly requires an absolute.
- Do not create three negative options and one positive option, or vice versa, unless polarity is irrelevant to correctness.

Correct-answer order should be randomized after item acceptance. Across a large served set, positions should be reasonably distributed, but exact 25/25/25/25 balancing is not required.

## 11. Explanation rules

The internal review explanation must contain:

1. the governing concept in original language;
2. the application of the relevant stem facts;
3. the calculation, if any; and
4. one short reason each distractor fails.

The student-facing explanation may be shorter, but it must teach rather than merely repeat the correct option. Do not fabricate a citation. Do not cite or name DECA, MBA Research, a test number, an official item, or a protected source in the explanation.

## 12. Exam-family authoring modules

Append exactly one of these modules to the base system prompt.

### 12.1 Business Administration Core module

```text
EXAM FAMILY: BUSINESS_ADMIN_CORE

Write broad, cross-functional business-foundation items appropriate to first-year Principles competitors. Prioritize the supplied quota and first-party objective. Use Prerequisite and Career Sustaining complexity for district/association plans; permit the plan's limited Specialist demand for ICDC.

Emphasize professional communication, emotional intelligence, financial fundamentals, information handling, operations, economics, customer relations, and professional development in the proportions supplied by the planner. Keep most settings recognizable to a student with limited business coursework: school-based work, entry-level employment, small teams, retail/service operations, and basic office situations.

Do not make this a management-cluster exam. Do not overuse supervisors, strategic planning, project portfolios, or specialized HR. Do not turn a Principles of Finance selection into a Finance Cluster question; event theme and written exam family are different inputs.
```

### 12.2 Business Management and Administration module

```text
EXAM FAMILY: BUSINESS_MANAGEMENT_ADMIN

Write business-management items with strong coverage of operations, strategic management, project management, knowledge management, information management, quality, and risk, while retaining the Business Administration Core content assigned in the plan.

Use realistic organizational constraints: authority, resources, schedules, policies, process capacity, stakeholder effects, documentation, change, and controls. Rotate contexts across administrative services, general management, business information management, human resources, operations, nonprofit organizations, government-adjacent offices, and commercial businesses.

Do not make every item about hiring or employee discipline. Do not assume the Management category is synonymous with HR. Avoid legal conclusions that require unstated jurisdiction-specific law.
```

### 12.3 Entrepreneurship module

```text
EXAM FAMILY: ENTREPRENEURSHIP

Write items across the venture lifecycle: opportunity recognition, customer discovery, validation, value proposition, business model, ownership, funding, cash needs, market planning, pricing, channels, operations, quality, risk, hiring, growth, and strategic choices. Use the plan's curriculum level; Entrepreneurship may include Prerequisite through Owner-level reasoning.

Scenarios may involve a prospective founder, new venture, established small business, family business, social enterprise, franchise candidate, or growing digital or physical operation. Make the venture stage explicit because the best action changes by stage.

Do not make every entrepreneur a technology founder seeking venture capital. Do not present rapid growth, debt, equity, franchising, or social-media promotion as automatically best. Separate customer evidence from founder enthusiasm and separate revenue growth from profit and cash flow.
```

### 12.4 Finance Cluster module

```text
EXAM FAMILY: FINANCE_CLUSTER

Write corporate and financial-services items with primary emphasis on financial analysis, financial-information management, professional development, risk management, law, controls, operations, and customer-facing finance. Use the exact instructional area and objective supplied by the plan.

Rotate among accounting, banking, credit, insurance, securities/investments, treasury, budgeting, lending, financial records, internal controls, and business finance. Use calculations only when the selected objective requires them. State all inputs, units, periods, conventions, and rounding instructions.

Do not confuse the Finance Cluster with Personal Financial Literacy. Do not provide individualized investment, tax, legal, credit, or insurance advice. Avoid facts that depend on current rates, contribution limits, tax brackets, laws, or product terms unless an approved current source packet supplies and dates them.
```

### 12.5 Hospitality and Tourism module

```text
EXAM FAMILY: HOSPITALITY_TOURISM_CLUSTER

Write items grounded in service operations, customer relations, information management, product/service management, selling, financial analysis, and professional conduct across lodging, restaurants, quick service, travel, tourism, attractions, events, convention services, and destination organizations.

Use hospitality-specific constraints when relevant: perishable capacity, reservations, arrival/departure timing, guest expectations, service recovery, accessibility, seasonality, demand forecasting, food or guest safety, channel partners, and cross-department coordination.

Do not make every setting a hotel front desk. Do not reward unauthorized compensation, unsafe shortcuts, false promises, discrimination, or concealment of service failures. Avoid jurisdiction-specific food, alcohol, employment, accessibility, or occupancy rules unless the approved packet supplies them.
```

### 12.6 Marketing Cluster module

```text
EXAM FAMILY: MARKETING_CLUSTER

Write items across marketing-information management, product/service management, promotion, selling, channel management, market planning, pricing, operations, financial analysis, economics, and professional skills according to the supplied quota.

Rotate B2C, B2B, nonprofit, local, digital, physical, service, retail, wholesale, sports/entertainment, and professional-selling contexts. Distinguish objectives such as awareness, consideration, conversion, retention, revenue, margin, reach, distribution coverage, and customer insight. Make data limitations explicit.

Do not make marketing synonymous with social media or advertising. Do not assume more impressions, followers, discounts, channels, or survey responses are automatically better. Avoid manipulative targeting, deceptive claims, dark patterns, and unsupported causal conclusions.
```

### 12.7 Personal Financial Literacy module

```text
EXAM FAMILY: PERSONAL_FINANCIAL_LITERACY

Write personal-decision items across earning income, spending, saving, investing, managing credit, and managing risk according to the supplied level quota and first-party objective. Test use of reliable information and systematic decision making, not corporate finance terminology.

Use inclusive household and individual contexts involving education/training, compensation, taxes at a general conceptual level, budgets, needs and wants, financial services, emergency savings, goals, time value, diversification, credit costs, borrowing capacity, insurance, identity protection, fraud, and risk reduction.

Do not provide personalized financial advice or imply guaranteed returns. Avoid current tax brackets, rates, contribution limits, laws, or proprietary product terms unless an approved, dated source packet supplies them. Do not assume a student has a particular family structure, income level, bank access, allowance, home ownership, or college plan.
```

## 13. Base system prompt

Use the following as the system message for the drafting model. Supply the item plan and approved concept packet separately as structured input.

```text
You are an assessment-item writer for an independent high-school business-education practice product.

MISSION
Create original, rigorous, four-option multiple-choice practice questions from the approved first-party item plans and concept packets supplied to you. Match the specified exam family, instructional area, cognitive operation, difficulty, stem form, and length range. Optimize educational validity, clarity, plausible distractors, and structural variety.

INTELLECTUAL-PROPERTY BOUNDARY
You have not been given and must not request, retrieve, recall, imitate, paraphrase, reconstruct, or claim access to any official DECA Inc., DECA+, MBA Research, released-exam, role-play, case-study, answer-key, LAP, prep-book, or third-party question-bank content. Do not browse for examples. Do not write a close variant of any remembered test item. Use only the first-party objective, concept packet, formulas, constraints, and abstract style targets supplied in this job. Never label an item official, actual, released, or endorsed.

ITEM REQUIREMENTS
1. Write exactly one item for each supplied item plan.
2. Use exactly four answer options.
3. Make exactly one option unambiguously correct from the stated facts.
4. Do not use true/false, multiple-response, all/none of the above, or combination answers.
5. Follow the plan's stem form and word range. Do not make every item a scenario.
6. Use only facts contained in the approved concept packet or stable common knowledge necessary to understand the setting.
7. Use fictional generic people and organizations. Do not use brands, celebrities, official event names, test numbers, or distinctive source scenarios.
8. Make each distractor a plausible named misconception, wrong sequence, wrong metric, partial calculation, overgeneralization, or constraint violation.
9. Keep options grammatically parallel and similar in specificity, tone, and length.
10. State every value, time period, unit, formula convention, and rounding rule required for a quantitative item.
11. Avoid hidden legal, regulatory, tax, medical, investment, or jurisdiction-specific assumptions.
12. Use inclusive, professional, accessible language and no stereotypes.

INTERNAL SOLVING
Before returning an item, solve it without looking at the proposed options. Then test every option against the stem. If two options can be defended, revise the stem or options. For a calculation, recompute it independently and verify units and rounding.

EXPLANATION
Give an original teaching explanation that states the governing concept, applies the stem facts, shows any calculation, and briefly explains why each distractor fails. Do not cite or mention a protected source.

OUTPUT
Return only a JSON array matching the supplied schema. Do not include Markdown, prose before the JSON, or additional keys. Do not expose chain-of-thought; provide only the concise review rationale fields requested by the schema.

REJECTION
If the concept packet is insufficient, internally inconsistent, appears to contain a protected test item, or would require a current or jurisdiction-specific fact that was not supplied, return the plan ID with status "rejected" and a short non-sensitive rejection reason. Do not fill gaps by browsing or guessing.
```

## 14. Generation job prompt

```text
Generate items for the attached ITEM_PLANS using only APPROVED_OBJECTIVES and APPROVED_CONCEPT_PACKETS.

Global bank targets:
- schema version: {{SCHEMA_VERSION}}
- bank version: {{BANK_VERSION}}
- authoring model/version: {{MODEL_VERSION}}
- maximum items in this batch: 20
- required exam-family module: {{EXAM_FAMILY_MODULE}}
- duplicate exclusion fingerprints: {{FIRST_PARTY_BANK_FINGERPRINTS}}
- prohibited product/source terms: {{PROHIBITED_TERMS}}

For every accepted item:
- preserve planId, objectiveId, examFamily, instructionalArea, difficulty, cognitiveOperation, and stemForm exactly;
- independently invent the setting and wording;
- return four answer strings and zero-based correctAnswer;
- return a studentExplanation and reviewRationale;
- identify the misconception type represented by each distractor;
- return calculationWork only when numeracy is not "none";
- return no citations, URLs, trademarks, or claims of official status; and
- self-audit against the acceptance checklist before setting status to "accepted".

ITEM_PLANS:
{{ITEM_PLANS_JSON}}

APPROVED_OBJECTIVES:
{{OBJECTIVES_JSON}}

APPROVED_CONCEPT_PACKETS:
{{CONCEPT_PACKETS_JSON}}

OUTPUT_SCHEMA:
{{OUTPUT_SCHEMA_JSON}}
```

Generate no more than 20 items at a time. A batch should contain different objectives and contexts so the model cannot fall into a repeated template rhythm.

## 15. Target item schema

The current runtime schema should be expanded so quality and provenance are reviewable before materialization.

```json
{
  "status": "accepted",
  "planId": "bank-v2-fin-00421",
  "itemId": "fin-v2-00421",
  "bankVersion": "2.0.0",
  "examFamily": "FINANCE_CLUSTER",
  "appCategory": "FINANCE",
  "competitionLevel": "district",
  "instructionalArea": "Financial Analysis",
  "objectiveId": "fin-analysis-cash-vs-profit-01",
  "difficulty": "intermediate",
  "cognitiveOperation": "diagnose",
  "stemForm": "short_scenario",
  "text": "Original item stem goes here.",
  "answers": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "studentExplanation": "Concise original teaching explanation.",
  "reviewRationale": {
    "conceptApplied": "Internal summary of the approved concept.",
    "distractorFailures": [
      "Correct option.",
      "Related-term confusion.",
      "Right action, wrong timing.",
      "Constraint violation."
    ]
  },
  "calculationWork": null,
  "provenance": {
    "rightsBasis": "first-party-authored",
    "objectiveVersion": "1.0.0",
    "promptVersion": "practice-master-1.0.0",
    "modelVersion": "record-exact-model-id",
    "generatedAt": "ISO-8601 timestamp",
    "humanReviewer": null,
    "reviewedAt": null
  }
}
```

Only accepted and human-approved fields needed at runtime should be materialized into the public JSON. Internal rationale, generation metadata, and review records should remain in a restricted authoring artifact.

## 16. Automated acceptance gates

An item must fail closed if any gate fails.

### 16.1 Schema and scoring

- valid exam family, level, instructional area, objective ID, form, and difficulty;
- exactly four nonempty, distinct options;
- integer `correctAnswer` from 0 through 3;
- unique item ID and normalized stem;
- no unreplaced tokens, placeholders, citations, URLs, or generation commentary; and
- a nonempty explanation consistent with the selected answer.

### 16.2 Answer validity

- an independent solver selects the keyed answer without seeing the key;
- a second verifier rejects any item with two defensible answers;
- quantitative items match deterministic calculation code;
- units, periods, and rounding are consistent; and
- the explanation does not contradict the stem or key.

The independent solver and verifier must not receive official exam content. They operate only on the candidate item and approved concept packet.

### 16.3 Style and form

- stem word count is within its item-plan range;
- answer options are grammatically parallel;
- answer-length outlier checks do not consistently reveal the key;
- negative stems are within family quota and visibly emphasized in the UI;
- no true/false, combination, all/none, trick, opinion-only, or trivia item;
- family-level form distributions remain within tolerance; and
- repeated openings and repeated scenario frames stay below configured thresholds.

### 16.4 Originality and source safety

- reject prohibited source/product names in stems, answers, and explanations;
- reject copied official identifiers, test numbers, distinctive fictional organizations, or source notes;
- reject phrase overlap caught by the existing non-reversible legacy-bank fingerprint filter;
- reject close semantic duplicates of the first-party bank;
- reject name/number swaps and template variants with the same fact graph and option logic;
- do not create or retain a searchable official-question corpus for screening; and
- escalate uncertain similarity to counsel or a rights-cleared review process.

### 16.5 Factual and temporal safety

- reject unsupported current rates, limits, law, tax, policy, product, or market claims;
- require `factAsOf` and an approved source packet for time-sensitive content;
- use fictional numbers that teach the concept when current real-world values are unnecessary;
- reject individualized financial, legal, medical, employment, or regulatory advice; and
- ensure the item remains answerable if the learner knows only the approved concept.

## 17. Duplicate and template-collapse controls

Two items are not meaningfully different merely because names, businesses, values, or option order differ.

Calculate and compare at least these fingerprints:

- normalized stem token n-grams;
- sentence-embedding similarity within the first-party bank;
- answer-set embedding similarity;
- item-plan tuple similarity;
- fact-graph signature: actor, goal, constraint, values, requested operation, and solution path;
- distractor misconception signature; and
- opening five-token frequency.

Suggested rejection thresholds, to be tuned on reviewed data:

- exact normalized stem duplicate: reject;
- eight-word first-party n-gram overlap above one phrase: manual review;
- stem embedding cosine similarity `>= 0.90`: reject unless a reviewer documents a distinct objective and solution path;
- fact-graph identity with only entity/value substitutions: reject;
- more than 2% of a family beginning with the same five normalized tokens: stop the batch; and
- more than six accepted items from one objective before the full objective catalog has minimum coverage: stop the batch.

Never compare by sending official protected items to the drafting model.

## 18. Human review rubric

Every item receives a 0-2 score in each dimension.

| Dimension | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Objective alignment | Tests another concept | Partial or indirect | Directly tests the approved objective |
| Single best answer | Ambiguous or wrong | Correct but weakly distinguished | One clearly defensible answer |
| Distractor quality | Absurd/clued/duplicate | Mixed plausibility | Three plausible, diagnostic errors |
| Family authenticity | Generic trivia or wrong family | Some family context | Correct scope, form, and cognitive demand |
| Clarity | Missing facts or confusing | Understandable with editing | Concise and self-contained |
| Explanation | Circular or incorrect | Correct but shallow | Teaches concept and diagnoses errors |
| Originality | Template/source concern | Similar internal pattern | Independently expressed and distinct |
| Fairness/accessibility | Biased or inaccessible | Minor concern | Inclusive and appropriately readable |

Acceptance requires:

- no zero in any dimension;
- at least 14 of 16 points;
- reviewer confirmation of the correct answer;
- a second reviewer for advanced, legal, quantitative, or time-sensitive items; and
- recorded reviewer identity and timestamp.

Automated checks run on 100% of items. Human review must also cover 100% before public release for the initial rebuilt bank. After a validated process and sufficient psychometric data exist, counsel and the assessment lead may approve a documented sampling regime for low-risk revisions.

## 19. Bank production workflow

1. **Version the sources.** Record the current official blueprint URL, school year, access date, and extracted non-expressive quotas.
2. **Build the objective catalog.** Independently author and review objective records and concept packets.
3. **Create the quota ledger.** Allocate the required item total across exam families, instructional areas, objectives, forms, cognition, difficulty, and contexts.
4. **Create deterministic item plans.** Give every planned item a stable seed and ID.
5. **Generate small batches.** Use the base system prompt plus exactly one family module.
6. **Run deterministic validators.** Reject schema, math, duplication, source-signal, style, and quota failures.
7. **Run independent answer verification.** The verifier does not see the key until after choosing.
8. **Conduct human SME review.** Record scores, edits, rejection reasons, and final key.
9. **Pilot.** Collect anonymous aggregate response statistics with appropriate privacy notice and retention limits.
10. **Calibrate.** Review item difficulty, discrimination, distractor selection, and differential performance; do not infer protected traits from users.
11. **Freeze and materialize.** Commit a versioned fixed JSON bank. Runtime requests only select and shuffle accepted items.
12. **Release notes and rollback.** Preserve the previous bank version and a question-level disable list for disputes or factual errors.

## 20. Psychometric calibration

After enough responses, calculate for each item:

- facility/difficulty: proportion answering correctly;
- point-biserial discrimination against total score, excluding the item;
- option-selection proportions;
- blank/timeout rate;
- median response time; and
- exposure rate.

Initial review triggers:

- correct rate below 20% or above 90% without intentional difficulty justification;
- non-positive discrimination;
- a distractor selected by fewer than 2% of adequately prepared examinees;
- very fast correct responses that suggest an obvious clue;
- response-time or performance anomalies after an edit; or
- user reports of ambiguity or factual error.

Do not tune only for low scores. The goal is valid discrimination across the intended learner range, not arbitrary difficulty.

## 21. Test assembly

### Full simulation

- exactly 100 items;
- exact selected level blueprint when feasible, with documented one-item rounding rules only when the published count itself varies;
- no duplicate objective within a short span when alternatives exist;
- controlled form, cognition, and difficulty mix;
- no repeated scenario organization or character;
- answer order shuffled with a signed server-side answer token; and
- fixed bank version recorded with the attempt.

### Quick practice

- select 8, 10, 20, or 25 existing items;
- stratify across high-weight instructional areas;
- rotate underexposed objectives over time;
- label the result a quick practice set, not a full simulated exam; and
- do not claim an 8-item set reproduces a 100-item blueprint.

### New-question behavior

"New questions" should mean a different selection from the fixed reviewed bank, not newly generated text. The same item may reappear after sufficient spacing. Track recent exposure per user when consent and retention settings allow it, and offer a reset control.

## 22. Required changes to the current implementation

Before regenerating the committed bank:

1. Add `examFamily`, `competitionLevel`, `instructionalArea`, `objectiveId`, `cognitiveOperation`, and `stemForm` to the authoring schema.
2. Expand `testBlueprints.ts` from 30 broad blueprints into the reviewed first-party objective catalog described above.
3. Replace high-volume template variants in `practiceQuestionBank.ts` with accepted authoring artifacts produced from deterministic item plans.
4. Keep runtime delivery deterministic; do not call a model when a learner opens or refreshes a test.
5. Add Business Administration Core and Personal Financial Literacy banks if the product promises coverage of every written-exam family.
6. Make event selection resolve to the correct exam family rather than deriving the family from the career-cluster label alone.
7. Add quota, form-distribution, objective-coverage, duplicate/fact-graph, and answer-verification tests.
8. Preserve the existing prohibited-source and legacy-fingerprint tests.
9. Do not publicly release a replacement bank until it passes automated validation and documented human review.

Implementation note (July 20, 2026): items 1, 2, 4, 5, 7, and 8 are implemented in the fixed 7,000-record bank. The records are marked `automated-validated`; the human editorial review gate in the release checklist remains open.

## 23. Release acceptance checklist

- [ ] The official blueprint school year and access date are recorded.
- [ ] All seven exam families are either implemented or clearly disclosed as unsupported.
- [ ] Event-to-exam-family routing has been verified.
- [ ] Every objective and concept packet has first-party provenance.
- [ ] No protected test item was used in a prompt, retrieval index, fine-tune, or rewrite workflow.
- [ ] Every item has one independently verified correct answer.
- [ ] Every quantitative item passes deterministic calculation tests.
- [ ] Instructional-area totals meet the selected bank quota.
- [ ] Form, length, cognition, and difficulty distributions meet family targets.
- [ ] Duplicate, template-collapse, and prohibited-source checks pass.
- [ ] Human review records exist for every released item.
- [ ] The UI displays the independent/unofficial disclaimer.
- [ ] Marketing makes no "actual," "official," "released," or endorsement claim.
- [ ] A question-level disable and complaint workflow is operational.
- [ ] Counsel has reviewed copyright, trademark, naming, and launch claims before a paid or broad public release.

## 24. Definition of done

A bank is not complete because it contains the requested number of JSON records. It is complete only when:

- the records cover the correct exam families and current blueprints;
- the content is independently authored from approved concept packets;
- form and cognitive variety match the measured aggregate structure;
- each answer and explanation is valid;
- duplicate/template collapse is controlled;
- every item has provenance and human review; and
- the fixed, versioned bank can be served without generating new question text at runtime.
