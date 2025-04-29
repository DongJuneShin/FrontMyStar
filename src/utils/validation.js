export const validationPhoneNumber = (phoneNumber) => {
    const phoneRegEx = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    return phoneRegEx.test(phoneNumber)
}

export const validationPassword = (password) => {
    const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/
    return passwordRegEx.test(password)
}
