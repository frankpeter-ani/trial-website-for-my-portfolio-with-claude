# Finara Platform — API & Service Specification

## Standard API Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "requestId": "req_892014891240"
}
```
In case of error:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "The transaction could not be processed due to insufficient available funds.",
    "requestId": "req_892014891240"
  }
}
```

---

## Core Service RPC Methods & Endpoints

### 1. Ledger & Transfers Service (`/src/services/transfers.ts`)
- `executeTransfer(params: TransferRequest): Promise<TransferResult>`
  - Requires: `sourceAccountId`, `destinationAccountId`, `amount`, `currency`, `idempotencyKey`.
  - Atomically records debit and credit entries in `ledger_entries`.

### 2. KYC Verification Service (`/src/services/kyc.ts`)
- `submitKycProfile(params: KycSubmissionRequest): Promise<KycProfile>`
- `uploadKycDocument(file: File, docType: string): Promise<DocumentReference>`

### 3. Risk Engine Service (`/src/services/risk.ts`)
- `evaluateTransactionRisk(tx: TransactionContext): Promise<RiskAssessment>`
  - Returns `score`, `reason`, `action ('approve' | 'review' | 'block')`.

### 4. Card Management Service (`/src/services/cards.ts`)
- `issueCard(userId: string, type: 'virtual' | 'physical'): Promise<CardRecord>`
- `updateCardControls(cardId: string, controls: CardControls): Promise<boolean>`
