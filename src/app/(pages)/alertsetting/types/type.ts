import { Dayjs } from "dayjs";

export type DropdownProps = {
    label: string;
    options: string[];
    selected: string;
    errors: any;
    onChange: (value: string) => void;
    changeFunction?: (value: any) => void;
}
export type SelectedValues = {
    id?: string;
    alertName: string;
    country: string;
    countryID: string;
    classification: string;
    riskScore: string;
    memberCount: string;
    // fromDate: string;
    date_range_from: string;
    date_range_to: string;
    status: string;
    user_id: string;
    // Add other properties as needed
}