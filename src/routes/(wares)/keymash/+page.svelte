<script lang="ts">
    import "$lib/keymash.css";
    import { onMount } from "svelte";

    const fitGradeBounds = (value: number) => {
        return Math.max(Math.min(Math.floor(value), 9), 1) as GradeScore
    }

    // stolen from wikipedia
    const time: [string, number][] = [
        ["ns", 10E+0],
        ["µs", 10E+3],
        ["ms", 10E+6],
        ["s", 10E+9],
        // copilot made below, no clue if this is true
        ["minutes", 6E+10],
        ["hours", 3.6E+12],
        ["days", 8.64E+13],
        ["weeks", 6.048E+14],
        ["months", 2.628E+16],
        ["years", 3.154E+17],
        ["decades", 3.154E+19],
        ["centuries", 3.154E+21],
        ["millennia", 3.154E+23],
        ["millennium", 3.154E+25],
    ]

    const SpeedTest: TestGrader = (keymash: string) => {
        return ["Speed", fitGradeBounds(keymash.length / 2)];
    }

    const RepetitionTest: TestGrader = (keymash: string) => {
        const charMap: Map<string, number> = new Map();
        for (const char of keymash) {
            if (charMap.has(char)) {
                charMap.set(char, charMap.get(char)! + 1)
            } else {
                charMap.set(char, 1)
            }
        }

        const penalty = keymash.length < 6 ? 5 : 10;

        // automatic F--- if keymash is empty
        const grade = charMap.size > 0 ? fitGradeBounds(penalty - Math.max(...Array.from(charMap.values()))) : 1;
        return ["Repetition", grade];
    }

    const StrengthTest: TestGrader = (keymash: string) => {
        let timeValue = keymash.length ** (8 + RepetitionTest(keymash)[1]);
        let timeUnit = "ns";

        let i = 0;
        while (timeValue / 100 > time[i][1] && i < time.length) {
            timeUnit = time[i][0];
            i++;
        }

        timeValue /= time[i][1];

        // space between
        if (i > 4) timeUnit = ` ${timeUnit}`;

        const timeToCrackText = timeValue > 0 ? `${timeValue.toPrecision(3)}${timeUnit}` : "an instant!";
        const crackMsg = `Bruteforced in ${timeToCrackText}`;
        return ["Strength", fitGradeBounds(i), crackMsg];
    }

    const tests = [
        SpeedTest,
        RepetitionTest,
        StrengthTest,
    ]

    const run = (keymash: string) => {
        return runAllTests(keymash)
    }

    const runAllTests = (keymash: string) => {
        return tests.map((test) => test(keymash))
    }

    const blankAllTests = (): [string, GradeScore][] => {
        return tests.map((test) => test("")).map((result) => [result[0], 0 as GradeScore])
    }

    let running = false;
    let input: HTMLInputElement;
    let counterButton: HTMLButtonElement;
    let countdown: HTMLParagraphElement;
    let results = $state(blankAllTests())

    type TestGrader = (keymash: string) => [string, GradeScore, string?];
    type GradeScore = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    const Grades: Map<GradeScore, string> = new Map([
        [9, "A"],
        [8, "B"],
        [7, "C"],
        [6, "D"],
        [5, "E"],
        [4, "F"],
        [3, "F-"],
        [2, "F--"],
        [1, "F---"],
        [0, "N/A"],
    ]);
    const meanGrade = (results: ReturnType<TestGrader>[]) => Math.round(results.map((result) => result[1]).reduce((a, b) => (a + b) as GradeScore) / results.length) as GradeScore;

    onMount(() => {
        // ez quick start hotkey (S)
        window.onkeydown = keyboardStart;
    })

    function startPreTest() {
        if (running) return;
        running = true;
        let c = 3;
        input.value = "get ready!";
        counterButton.disabled = true;
        countdown.textContent = c.toString();
        countdown.classList.remove("countdown-running");
        countdown.classList.add("countdown-prerun");

        const pre_cd = setInterval(() => {
            c -= 0.1;
            countdown.textContent = Math.abs(c).toFixed(1);
            if (c <= 0) {
                clearInterval(pre_cd);
                mainTest()
            }
        }, 100)

    }

    function mainTest() {
        let c = 0.7;
        countdown.classList.remove("countdown-prerun");
        countdown.classList.add("countdown-running");
        input.value = "";
        input.disabled = false;
        input.select();

        const cd = setInterval(() => {
            c -= 0.01;
            countdown.textContent = Math.abs(c).toFixed(2);
            if (c <= 0) {
                clearInterval(cd);
                input.disabled = true;
                counterButton.disabled = false;
                countdown.classList.remove("countdown-running");
                countdown.textContent = "...";
                running = false
                results = run(input.value)
            }
        }, 10)
    }

    function keyboardStart(e: KeyboardEvent) {
        if (e.key === " " && !running) startPreTest();
    }
</script>

{#snippet grade_text(grade)}
    <span class={`grade grade-${grade}`}>{Grades.get(grade)}</span>
{/snippet}

{#snippet test(name, grade, info)}
    <p class="text-2xl font-bold">
        {name}:
        {@render grade_text(grade)}
        {#if info}
            <span class="test-info">{info}</span>
        {/if}
    </p>
{/snippet}

{#snippet total_grade(results)}
    <div class="text-5xl text-center mb-12">
        <span class="mr-2">Total Grade: </span>{@render grade_text(meanGrade(results))}
    </div>
{/snippet}

{#snippet test_list(results)}
    <div class="tests">
        {#each results as result}
            {@render test(result[0], result[1], result[2])}
        {/each}
    </div>
{/snippet}

<svelte:head>
    <title>Keymash Grader</title>
    <link rel="icon" href="wares/keymash/favicon.png" />
</svelte:head>

<header class="text-center">
    <h1>Keymash Grader</h1>
    <p class="my-4">think your good at keymashing? probably</p>
</header>
<main class="app">
    <div class="counter">
        {@render grade_text(results)}
        {@render total_grade(results)}
        <div class="max-md:grid-rows-2 grid md:grid-cols-2 gap-4 justify-items-center items-center">
            <div>
                <input bind:this={input} class="w-full text-3xl p-1 rounded ring-1 ring-gray-500" disabled placeholder="type here"/>
                <button bind:this={counterButton} onclick={startPreTest} class="py-1 px-2.5 my-2 rounded ring-1 ring-gray-500">Start! (Space)</button>
                <p bind:this={countdown} class="m-0 text-9xl text-center">...</p>
            </div>
            <div>
                <p class="text-center">
                    Press Start to get a 3 second count down to prepare. When it hits zero,
                    start keymashing! You will have 700 milliseconds and it will be graded based on how good you are.
                    <br/><br/>
                    You do not need to click on the input box at the start; it will automatically focus once the timer begins.
                </p>
                <hr/>
                {@render test_list(results)}
            </div>
        </div>
        <hr/>
    </div>
</main>
<footer class="md:absolute bottom-0 text-xs m-2.5">
    <span>Made by Zelo101, 2021</span>
    <div class="inline-flex *:px-2 *:py-1 *:mx-1 *:rounded *:ring-1 *:ring-black hover:*:scale-105 *:transition-transform">
        <a href="../">Back to Site</a>
        <a target="_blank" rel="noopener" href="https://github.com/Zolo101/zelo.dev/blob/master/src/routes/(wares)/keymash/%2Bpage.svelte">Source Code</a>
    </div>
</footer>

<style>
    hr {
        margin: 1rem 0;
    }

    .counter-main {
        display: grid;
        grid-template-columns: repeat(2,1fr);
        justify-items: center;
        align-items: center;
    }

    .counter-info {
        text-align: center;
    }

    .counter-input {
        width: 100%;
        font-size: 2rem;
    }

    .counter-button {
        padding: 5px 10px;
        margin: 5px 0;
        font-size: 1em;
    }

    .countdown {
        margin: 0;
        font-size: 10rem;
        line-height: 10rem;
        text-align: center;
    }

    .countdown-prerun {
        color: orange;
    }

    .countdown-running {
        color: green;
    }

    .grade {
        font-weight: bold;
    }

    .grade-1 {
        color: #000;
    }

    .grade-2 {
        color: #556b2f;
    }

    .grade-3 {
        color: gray;
    }

    .grade-4 {
        color: green;
    }

    .grade-5 {
        color: #8ed327;
    }

    .grade-6 {
        color: #daa520;
    }

    .grade-7 {
        color: gold;
    }

    .grade-8 {
        color: orange;
    }

    .grade-9 {
        color: #ff5e00;
        text-shadow: 0 0 4px orange;
    }

    .test {
        font-size: 1.4rem;
        font-weight: bold;
        line-height: .4em;
        text-align: left;
    }

    .test-info {
        color: gray;
        font-size: .8rem;
        font-style: italic;
        margin-left: 20px;
    }

    .line {
        border: thin solid lightgrey;
        margin: 20px 0;
    }

    .total-grade {
        font-size: 2.5rem;
        text-align: center;
        margin-bottom: 50px;
    }
</style>
