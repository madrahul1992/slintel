function myFunction() {
    /* Get the text field */
    const copyText = <HTMLInputElement>document.getElementById("myInput");
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    /* Copy the text inside the text field */
    document.execCommand("copy");
    /* Alert the copied text */
    alert("Copied the sharable thumbnail url: " + copyText.value);
}