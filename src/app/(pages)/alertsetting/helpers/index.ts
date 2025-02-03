export function interpretPercentage(input) {
    if (/^[<>]/.test(input)) {
        return `${input.startsWith("<") ? "Less than" : "Greater than"} ${input.slice(1)}`;
    }
    return input; // Return the input unchanged if it doesn't include < or >
}