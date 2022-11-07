function log(text) {
    document.querySelector("#logger").innerHTML = text + "\n" + 
                                    document.querySelector("#logger").innerHTML;
}