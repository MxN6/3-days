// async function fetchAIResponse(input) {
//     const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B', {
//         method: 'POST',
//         headers: {
//             Authorization: 'Bearer ',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             inputs: input,
//         }),
//     });

//const { stringify } = require("openai/internal/qs/stringify.mjs");

//     const result = await response.json();
//     console.log(result);
//     return result[0].generated_text;
// }

const outputDiv = document.querySelector('.output');
const inputField = document.getElementById('text');

let currentLocation = "start";
const inventory = [];
const items = ['key', 'leaflet', 'apple', 'bag'];
const locations = {
    start: {
        description: "You are standing in an open field west of a yurt. There is a `chest` nearby.",
        actions: {
            open: "chest",
            go: "north, east, west, south"
        },
        directions: {
            north: "steppe_north",
            east: "yurt",
            west: "steppe_west",
            south: "steppe_south"
        }
    },
    steppe_north: {
        description: "Standing on the vast steppe, you feel the endless horizon stretch beneath an open sky, with nothing but the wind and grass to keep you company.",
        directions: {
            south: "start",
            north: "bazaar",
            west: "charyn_canyon",
            east: "caravan"
        }
    },
    yurt: {
        description: "You are inside a yurt. There is a table with a `key` on it.",
        actions: {
            take: "key"
        },
        directions: {
            west: "start"
        }
    },
    steppe_west: {
        description: "The wide expanse of the steppe unfolds around you like an ocean of green, where silence and space seem infinite.",
        directions: {
            east: "start",
            north: "charyn_canyon",
            west: "tian_shan",
            south: "apple_orchards"
        }
    },
    steppe_south: {
        description: "On the boundless steppe, the earth and sky merge in the distance, leaving you alone in the quiet embrace of nature's immensity.",
        directions: {
            north: "start",
            west: "apple_orchards"
        }
    },
    bazaar: {
        description: "Amidst the vibrant, bustling stalls of a Kazakh bazaar, filled with the scent of fresh spices and the sound of traders haggling, a familiar face emerges from the `crowd`, briefly meeting your gaze before disappearing into the lively throng.",
        actions: {
            gaze: "crowd",
        },
        directions: {
            south: "steppe_north",
        }
    },
    charyn_canyon: {
        description: "Charyn `Canyon`, with its deep red cliffs and winding river, stands like a majestic labyrinth carved by time, a breathtaking natural wonder stretching endlessly across the rugged Kazakh landscape.",
        actions: {
            gaze: "canyon",
        },
        directions: {
            east: "steppe_north",
            south: "steppe_west"
        }
    },
    caravan: {
        description: "On the vast, windswept steppe, a caravan halts beside a gentle stream, the grasses swaying around the resting camels and travelers as they take respite beneath the wide, open sky that seems to stretch forever. As you ask about the fraud, they deny presence of any lawbreaker in their `crowd`.",
        actions: {
            gaze: "crowd",
        },
        directions: {
            west: "steppe_north",
            
        }
    },
    tian_shan: {
        description: "The snow-capped peaks of the Tian Shan `mountains` rise like jagged sentinels against the sky, their pristine glaciers and alpine meadows seemingly untouched by the world below.",
        actions: {
            gaze: "mountains",
        },
        directions: {
            east: "steppe_west"
        }
    },
    apple_orchads: {
        description: "Nestled in the foothills, the `apple` orchards stretch out in neat rows, their trees heavy with vibrant, juicy Aport apples that gleam in the sunlight, each one a symbol of Kazakh’s rich, fertile land and agricultural pride.",
        actions: {
            take: "apple",
        },
        directions: {
            east: "steppe_south",
            north: "steppe_west"
        }
    }
};

function addParagraph(text) {
    const newParagraph = document.createElement('p');
    newParagraph.textContent = text;
    outputDiv.appendChild(newParagraph);
    outputDiv.scrollTop = outputDiv.scrollHeight;
}

function describeLocation(location) {
    const loc = locations[location];
    addParagraph(loc.description);
    if (loc.actions) {
        addParagraph("You can: " + Object.keys(loc.actions).join(", "));
    }
    if (loc.directions) {
        addParagraph("Exits are: " + Object.keys(loc.directions).join(", "));
    }
}
let flag = true;
function handleCommand(command) {
    const loc = locations[currentLocation];
    const words = command.toLowerCase().split(" ");
    const action = words[0];
    const target = words[1];
    flag = true;

    if (action === "go") {
        if (loc.directions && loc.directions[target]) {
            currentLocation = loc.directions[target];
            describeLocation(currentLocation);
        } else {
            addParagraph("You feel that you should not go there.");
        }
    }
    else if (action === "take") {
        if (loc.actions && loc.actions.take === target && items.includes(target)) {
            inventory.push(target);
            addParagraph(`You take the ${target}.`);
            delete loc.actions.take;
        } else {
            addParagraph(`There is no ${target} here.`);
        }
    } else if (locations.start.actions.open && action === "open" && target === "chest" && currentLocation === "start" && inventory.includes("key")) {
        addParagraph("You open the chest and find a `leaflet` that you can `read`.");
        inventory.push("leaflet");
        delete locations.start.actions.open;
    } else if (action === "look") {
        describeLocation(currentLocation);
    } else if(action ==="read" && target === "leaflet" && inventory.includes("leaflet")) {
        addParagraph("Ehehehe! I stole your most valuable item! try to find me! <3")
    }else if(action ==="eat" && target === "apple" && inventory.includes("apple")) {
        addParagraph("Biting into a ripe Aport apple is like tasting the essence of autumn—its crisp skin gives way to a burst of sweet, slightly tart juice that floods your mouth, while the firm, fragrant flesh crunches with every satisfying bite, leaving a refreshing, invigorating taste that lingers.")
    } else if (action === "go" && currentLocation === "yurt" && target!=="west") {
        addParagraph("Round walls confuse you with directions.");
        describeLocation(currentLocation);
        flag = false;
    } else if(action==="gaze" && target=="canyon" && currentLocation=="charyn_canyon") {
        addParagraph("Standing at the edge of Charyn Canyon, you're met with a breathtaking view of towering red and orange rock formations, carved by centuries of wind and water, stretching out beneath the vast blue sky; the river winding far below, cutting through the rugged landscape like a shimmering ribbon in the desert stillness.")
    }else if(action==="gaze" && target=="mountains" && currentLocation=="tian_shan") {
        addParagraph("Gazing upon the Tian Shan mountains, their majestic peaks rise sharply against the horizon, cloaked in a pristine blanket of snow and crowned with glistening glaciers, while lush green valleys below teem with vibrant wildflowers, creating a stunning contrast that showcases the breathtaking beauty of this vast, untouched wilderness.")
    }else if(action==="gaze" && target=="crowd" && currentLocation=="bazaar") {
        addParagraph("In the bustling crowd, a `familiar-face` stands out—a warm smile and twinkling eyes that instantly evoke memories of shared laughter and cherished moments, making the chaotic scene feel like a comforting reunion. You thought.")
        locations.bazaar.actions['chase'] = "familiar-face";
    }else if(action==="gaze" && target=="crowd" && currentLocation=="caravan") {
        addParagraph("The caravan crowd buzzes with life, as merchants enthusiastically barter their goods, children dart between the bustling camels, and laughter mingles with the aroma of spiced food, creating a vibrant tapestry of culture and community on the sprawling steppe.")
    }
    else if (action==="chase" && target==="familiar-face" && currentLocation==="bazaar") {
        addParagraph("As I weave through the throng, my heart races in pursuit of the familiar face, and when I finally catch up to him, I `open` the `bag` slung over his shoulder, revealing a trove of forgotten treasures that spark a rush of nostalgia.")
        inventory.push("bag");
    } else if (action==="open" && target=="bag" && inventory.includes("bag")) {
        addParagraph("As you carefully open the bag, your eyes are drawn to a charming statue of a dombra, the iconic national musical instrument, alongside a baursak, the fluffy, golden pastries cherished in your culture. A rush of memories floods your mind, reminding you of your Kazakh roots. You are Kazakh.");
        await(1);
        addParagraph("Thank you for playing my game(?) I know it is low quality and have a bad code, but I hope you understood the concept of text-based game that I planned to make!");
    }
    else if (action==="inventory") {
        if (inventory.length!==0) {
            addParagraph(inventory.join(", "))
    }else {
        addParagraph("you have nothing")
    }
    }
    else {
        addParagraph("Maybe you should think.");
        describeLocation(currentLocation);
        flag = false;
    }
}
let moves = 0;
let counter = document.getElementById("moves");
inputField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const command = inputField.value.trim();
        if (command !== "") {
            addParagraph(command);
            handleCommand(command);
            inputField.value = '';
            if (flag === true) {
                moves++;
                counter.value = moves;
            }
        }
    }
});

// Start the game
addParagraph("Welcome to the Zork-like adventure! type 'look' to look surroundings and possible actions and type 'inventory' to check you bag");
describeLocation(currentLocation);


