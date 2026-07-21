# Practice-test copyright-safety review

Date: July 20, 2026
Scope: multiple-choice practice questions and explanations
Status: engineering risk reduction, not legal advice or a non-infringement opinion

## Executive conclusion

The previous `app/questions.tsx` bank was unsafe to publish. Repository history identified it as imported exam material, and exact-phrase checks found verbatim matches to published DECA/MBA Research exam items. Rewording those items with AI would not solve the problem: it would still use protected source expression to prepare substitutes or derivative versions.

The file—310 questions, answer sets, and explanations—was removed. The current replacement is a committed bank of 7,000 stable items—1,000 in each of seven written-exam families—built from a first-party concept catalog and deterministic scenario, classification, application, diagnosis, comparison, and calculation builders. It uses general business and personal-finance concepts without using official questions, DECA+ content, released exams, role-plays, or third-party question banks as source material. Runtime test delivery never calls an AI model.

The research-backed requirements for the next independently authored bank are defined in [`practice-question-generation-master-framework.md`](./practice-question-generation-master-framework.md). That framework separates all seven written-exam families, applies the current 2026-2027 allocation facts, and keeps official sample wording out of model context.

## Governing risk principles

DECA's current [Copyright + Integrity Agreement](https://www.deca.org/advisor-resources/competitive-events-district-instructional-areas) states that competitive scenarios may not be banked, reused to develop other scenarios, edited, rewritten, or posted online outside the stated distribution rules. The [DECA+ Acceptable Use Policy](https://www.decaplus.org/) separately prohibits publishing, posting, sharing, or distributing its exams, scenarios, sample entries, or individual items beyond the purchasing chapter.

Under the U.S. Copyright Office's [copyright-protection guidance](https://www.copyright.gov/help/faq/faq-protect.html), facts, ideas, systems, and methods are not protected in themselves, but their particular written expression can be. General concepts such as contribution margin, delegation, segmentation, service recovery, or customer discovery can therefore be taught through independently created facts and language. That does not authorize copying a publisher's question stem, fictional facts, answer set, distractor design, explanation, or selection and arrangement.

The Copyright Office also cautions that only the copyright owner can authorize a new version of a protected work and that merely changing it does not automatically create a lawful work. Fair use is a case-specific four-factor inquiry; educational purpose helps but is not dispositive, especially where a use copies substantial material or substitutes for a paid market. See the [derivative-work FAQ](https://www.copyright.gov/help/faq/faq-fairuse.html) and [four-factor fair-use guidance](https://www.copyright.gov/fair-use/more-info.html).

## Implemented authorship boundary

### 1. No protected source ingestion

Test authors, reviewers, prompts, and development tools must never receive or use:

- official or released DECA questions, exams, answer keys, scenarios, or judge material;
- DECA+ content;
- MBA Research questions, LAP content, answer explanations, or proprietary item banks;
- screenshots, PDFs, flashcard exports, or user-pasted questions from those sources;
- third-party prep-book or certification questions.

The removed bank is not available to the application. A non-readable Bloom filter retains only hashed eight-word fingerprints so automated tests can reject accidental phrase overlap; it cannot render or serve the original questions.

### 2. First-party concept blueprints

`app/data/testBlueprints.ts` contains 690 Deca Pal-authored concept blueprints across Business Administration Core, Management, Entrepreneurship, Finance, Hospitality and Tourism, Marketing, and Personal Financial Literacy. Each blueprint includes only a general topic, learning goal, concept notes, an original example, application guidance, a common error, and permitted assessment forms. It contains no official question wording, fictional facts, distractor sets, answer keys, test identifiers, or published explanations.

### 3. Separately authored question bank

`app/data/practiceQuestionBank.ts` contains deterministic item builders for all 690 concept blueprints, and `app/data/practiceQuestionBank.generated.json` stores the resulting fixed records. The bank has exactly 1,000 items in each of seven exam families, distributed at ten times the current 100-question district/association instructional-area allocation. Each item has a persistent ID, exam family, instructional area, objective ID, cognitive operation, stem form, answer set, explanation, difficulty, and `automated-validated` review status. The bank does not describe its content as official or previously used. Automated tests inspect every record; human editorial review remains required before treating the bank as release-reviewed.

### 4. Automated bank screening

The test suite fails when an authored item:

- names DECA, DECA+, MBA Research, ICDC, an official exam, a question bank, or a test number;
- uses a deliberately blocked bank-style opening;
- contains too little context to support an independently expressed scenario;
- contains duplicate answers, invalid scoring, unsupported blueprint IDs, or malformed text;
- has a duplicate identifier or stem, leaves an objective without coverage, or misses an instructional-area quota; or
- matches two or more hashed eight-word fingerprints from the removed legacy bank.

New and revised items must pass these checks before release. Human review is still required because automated checks cannot determine authorship, permission, or educational accuracy by themselves.

### 5. Clear provenance and labeling

Every returned question carries its stable item ID, bank version, blueprint ID, and a `first-party-authored` provenance marker. The UI identifies the set as an original first-party question bank and expressly states that it is neither an official exam nor endorsed by DECA Inc.

### 6. Signed answer verification

The old progress API verified answers by searching the copied static bank. The replacement shuffles answer choices and signs each served question and correct-answer index with a short-lived server token. Progress updates require a valid user-bound signature, allowing the copied bank to remain deleted.

## Practices that remain prohibited

- Do not ask AI to “make this DECA question different,” swap names or numbers, translate it, shorten it, or generate close variants.
- Do not scrape public or paid DECA/MBA Research resources into a retrieval system, vector database, fine-tuning set, prompt library, or similarity seed.
- Do not treat Quizlet, Stuvia, shared drives, or unofficial mirrors as permission; an unauthorized repost does not grant downstream rights.
- Do not market practice content as “official,” “released,” “actual,” “real exam,” or guaranteed to predict a competition.
- Do not use DECA logos, trade dress, or wording that implies sponsorship without separate authorization.
- Do not rely on “educational use” as blanket permission.

## Residual risk and required operations

No automated filter can guarantee non-infringement. Independent authors can accidentally produce similar language, the Bloom filter only covers the removed local bank, and broader similarity can require human or licensed-search review.

Before a paid or broad public launch:

1. Have qualified U.S. copyright/trademark counsel review this design, the product name and marketing claims.
2. Record authorship and revision history for every concept blueprint and question-bank item.
3. Review additions and revisions for accuracy and similarity; preserve review records without retaining disputed protected text longer than necessary.
4. Monitor `COPYRIGHT_CONTACT_EMAIL`, promptly disable disputed output, preserve the complaint, and document the resolution.
5. If users are ever allowed to submit prompts or source material, add upload prohibitions, repeat-infringer handling, and counsel-reviewed notice/takedown procedures before enabling that feature.
6. Keep test-bank content out of roleplay model prompts and any future retrieval, training, or generation system unless counsel has reviewed that new workflow.
7. Seek a written license if the business later wants to reproduce or adapt official exam items rather than create independent practice.

## Verification

Automated tests cover all seven family totals, district/association quota assembly, objective completeness, unique IDs and stems, schema constraints, prohibited source signals, legacy-bank phrase overlap, answer-token tampering, token/user/question binding, and expiration. Run:

```sh
npm run typecheck
npm test -- --runInBand
npm run lint
npm run build
```
