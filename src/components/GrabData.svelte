<script>
    import { onMount } from "svelte";
    import { csv, timeParse } from "d3";

    import { topicToSlugMap } from "$components/topics.js";

    export let data = [];

    const fetchData = async () => {
        const res = await csv("/datasets.csv");
        const newData = res
            .map(d => {
                const searchString = [d.headline, d.text, d.links]
                    .join(", ")
                    .toLowerCase();
                const topics = searchString
                    .split(" ")
                    .map(d => topicToSlugMap[d])
                    .filter(d => d);
                return {
                    ...d,
                    searchString,
                    topics,
                    date: timeParse("%Y.%m.%d")(d.edition)
                };
            })
            .sort((a, b) => b.date - a.date);
        data = newData;

        // let commonWords = {};
        // data.forEach(d => {
        //   const words = d.searchString.split(" ");
        //   words.forEach(word => {
        //     if (!commonWords[word]) commonWords[word] = 0;
        //     commonWords[word]++;
        //   });
        // });
        // let sortedCommonWords = [];
        // Object.keys(commonWords).forEach(word => {
        //   if (commonWords[word] < 50) return;
        //   sortedCommonWords.push([word, commonWords[word]]);
        // });
        // sortedCommonWords = sortedCommonWords.sort((a, b) => b[1] - a[1]);
        console.log(res[0]);
        // console.log(sortedCommonWords);
    };
    onMount(fetchData);
</script>
