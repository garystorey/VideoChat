export const getGreetingTime = (m) => {
    if (!m || !m.isValid()) { return; } //if we can't find a valid or filled moment, we return.

    const split_afternoon = 12; //24hr time to split the afternoon
    const split_evening = 17;  //24hr time to split the evening
    const currentHour = parseFloat(m.format("HH"));
    if (currentHour >= split_afternoon && currentHour <= split_evening) {
        return "afternoon";
    }
    if(currentHour >= split_evening) {
        return "evening";
    }
    return "morning";
};

/*
    Get a humanized, "Morning", "Afternoon", "Evening" from moment.js **Great for user greetings!**
    Source: https://gist.github.com/James1x0/8443042
*/
