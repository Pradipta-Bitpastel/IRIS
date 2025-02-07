export type TranslationResponse = {
    data: {
        translations: {
            translatedText: string;
        }[];
    };
}
export type initialValues = {
    id: "",
    alertName: "",
    country: "",
    countryID: "",
    classification: "",
    riskScore: "",
    memberCount: "",
    date_range_from: "",
    date_range_to: "",
    status: "1",
    user_id: "",
  };