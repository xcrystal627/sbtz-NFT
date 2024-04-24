export const SBTZContractAddress =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x19C0e2dD955150dc4f163543b5e7BFd81C5272c2";
//0xebBA54eBDfF8aBd468F043a12b78c5A5601B264c

type PlanType = {
  planName: string;
  price: string;
  per: string[];
  detail: string[];
};
// type;

export const planDescriptions: PlanType[] = [
  {
    planName: "Free",
    price: "$ 0",
    per: ["Per Community", "Per Month"],
    detail: [
      "専用ページ（SBT発行・メンバー管理）",
      "Admin追加",
      "SBT 発行・進呈 100個まで",
    ],
  },
  {
    planName: "Regular",
    price: "$ 20",
    per: ["Per Community", "Per Month"],
    detail: [
      "専用ページ（SBT発行・メンバー管理）",
      "Admin追加",
      "SBT 発行・進呈無制限",
    ],
  },
  {
    planName: "Customization",
    price: "ASK",
    per: [""],
    detail: [
      "Reularプラン各機能のオリジナル仕様",
      "AI他各種サービス連携",
      "SBT所有確認設定",
      "その他",
    ],
  },
];
