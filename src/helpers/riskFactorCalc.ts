// import { risk_factor_db } from "@/_assets/datasets/db";

// import { RiskFactor } from "@/types/type";

// export const riskFactorCalc = (risk_score_def: string): RiskFactor => {
//     let risk_fact_obj: RiskFactor = {} as RiskFactor;

//     const risk_score = +(risk_score_def.split('%')[0]);

//     if (risk_score < 30) {
//         risk_fact_obj = { ...risk_factor_db.filter((risk_scor_obj: RiskFactor) => risk_scor_obj.risk_factor === '<30')[0] };
//     } else if (risk_score < 70) {
//         risk_fact_obj = { ...risk_factor_db.filter((risk_scor_obj: RiskFactor) => risk_scor_obj.risk_factor === '<70')[0] };
//     } else if (risk_score < 100) {
//         risk_fact_obj = { ...risk_factor_db.filter((risk_scor_obj: RiskFactor) => risk_scor_obj.risk_factor === '<100')[0] };
//     }

//     return risk_fact_obj;
// };
