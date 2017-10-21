'use strict';
window.addEventListener('load',
    function () {

        let difficulty, containerClass,
            randomImages = [],
            oneCardTurned = false;

        //Selector function
        const $$ = (selector) => document.querySelector(selector);

        //Array of all images
        const images = [
            'img/1.jpg',
            'img/2.jpg',
            'img/3.jpg',
            'img/4.jpg',
            'img/5.jpg',
            'img/6.jpg',
            'img/7.jpg',
            'img/8.jpg',
            'img/9.jpg',
            'img/10.jpg',
            'img/11.jpg',
            'img/12.jpg',
            'img/13.jpg',
            'img/14.jpg',
            'img/15.jpg',
            'img/16.jpg',
            'img/17.jpg',
            'img/18.jpg'
        ]

        //Shuffle the elements in the array
        function shuffle(array) {
            let currentIndex = array.length, temporaryValue, randomIndex;

            //While there are items to shuffle
            while (0 !== currentIndex) {

                //Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                //Swap it with the current item
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

        //Flip Images
        function flipImage(card) {
            if (!card.classList.contains('flipped')) {
                card.classList.add("flipped");
            } else {
                card.classList.remove("flipped");
            }
        }

        //Picking a random image
        const pickRandomImages = () => images[Math.floor(Math.random() * images.length)];

        function setContainerClass() {
            //Set difficulty
            difficulty = $$('#difficulty').options[$$('#difficulty').selectedIndex].value;

            //Setting container class
            switch (difficulty) {
                case '4':
                    containerClass = "easy";
                    break;
                case '8':
                    containerClass = "normal";
                    break;
                case '16':
                    containerClass = "hard";
                    break;
                case '36':
                    containerClass = "very-hard";
                    break;
            }

            $$('#items').classList.add(containerClass);

            //Hiding the start box
            $$('#start').classList.add("hide");
        }

        //Clicking start button
        $$('#game-start').onclick = function () {


            if ($$('#difficulty').selectedIndex == 0) {
                alert('Please select a difficulty');
            } else {

                setContainerClass();


                //Picking random images
                for (let index = 0; index < difficulty; index += 2) {
                    let randomImage = pickRandomImages();
                    //Make sure no image is picked more than once
                    while (randomImages.indexOf(randomImage) > -1) {
                        randomImage = pickRandomImages();
                    }
                    randomImages[index] = randomImage;
                    randomImages[index + 1] = randomImage;

                }

                //Randomizing the items in randomImages array
                shuffle(randomImages);

                //Creating cards and rendering on page
                for (let index = 0; index < randomImages.length; index++) {
                    let card = document.createElement('div');
                    let cardImage = document.createElement('img');
                    cardImage.setAttribute('src', randomImages[index]);
                    card.appendChild(cardImage);
                    $$('#items').appendChild(card);
                }

                //Flipping items at the beginning
                setTimeout(function () {
                    for (let index = 0; index < document.querySelectorAll('#items div').length; index++) {
                        flipImage(document.querySelectorAll('#items div')[index]);
                    }
                    $$('#restart').classList.remove('hide');
                }, 700);
            }

        };



        //Clicking cards
        $$('#items').addEventListener("click", function (e) {
            if (e.target.nodeName == "DIV") {

                flipImage(e.target);

                if (false === oneCardTurned) {
                    e.target.classList.add("face-up");
                    oneCardTurned = true;
                } else {
                    e.target.classList.add("match");
                    isMatch();
                }

            } else if (e.target.nodeName == "IMG") {

                //Checking if card has been matched before
                if (e.target.parentElement.classList.contains('matched')) {
                    return false;
                }

                flipImage(e.target.parentElement);
                e.target.parentElement.classList.remove("face-up");
            }
        });

        //Check if items match
        function isMatch() {

            if ($$('.face-up img').getAttribute('src') === $$('.match img').getAttribute('src')) {
                oneCardTurned = false;
                $$('#correct').innerHTML++;
                $$('.face-up').classList.add("matched");
                $$('.face-up').classList.remove("face-up");
                $$('.match').classList.add("matched");
                $$('.match').classList.remove("match");

                //Ending the game
                if ($$('#correct').innerHTML == (difficulty / 2)) {
                    setTimeout(function () {
                        $$('#end').classList.remove("hide");
                        $$('#endtime').innerHTML = (" " + $$('#correct').innerHTML + " moves");
                        $$('#restart').classList.add("pulse");
                    }, 300);
                }
            } else {
                setTimeout(function () {
                    oneCardTurned = false;
                    $$('#miss').innerHTML++;
                    flipImage($$('.face-up'));
                    flipImage($$('.match'));
                    $$('.face-up').classList.remove("face-up");
                    $$('.match').classList.remove("match");
                }, 300);
            }

        }


        //Restart button
        $$('#restart').onclick = function () {
            difficulty = null;
            randomImages = [];
            $$('#items').innerHTML = "";
            $$('#items').classList.remove(containerClass);
            $$('#correct').innerHTML = 0;
            $$('#miss').innerHTML = 0;
            $$('#start').classList.remove("hide");
            $$('#difficulty').selectedIndex = 0;
            $$('#restart').classList.remove("pulse");
            $$('#restart').classList.add('hide');
            $$('#end').classList.add('hide');
        }


    }, false);