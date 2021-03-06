const form = document.getElementById('vote-form');


//form submit events
form.addEventListener('submit', (e) => {
    const choice = document.querySelector('input[name=os]:checked').value;
    const data = { os: choice };


    fetch('http://localhost:3000/poll', {
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));

    e.preventDefault();
});
fetch('http://localhost:3000/poll')
    .then(res => res.json())
    .then(data => {
        let votes = data.votes;
        let totalVotes = votes.length;
        const voteCounts = votes.reduce((acc, vote) => (
            (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc),
            {}
        );

        let dataPoints = [
            { label: 'Data Structure', y: voteCounts.Windows },
            { label: 'DBMS', y: voteCounts.MacOs },
            { label: 'Operating System', y: voteCounts.Linux },
            { label: 'Computer Networks', y: voteCounts.Other }
        ];

        const chartContainer = document.querySelector('#chartContainer');

        if (chartContainer) {

            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme1',
                title: {
                    text: `Total Votes ${totalVotes}`
                },
                data: [
                    {
                        type: 'column',
                        dataPoints: dataPoints
                    }
                ]
            });
            chart.render();

            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = true;

            var pusher = new Pusher('1833e2f505b82269a00a', {
                cluster: 'ap2',
                encrypted: true
            });

            var channel = pusher.subscribe('realTimePoll');
            channel.bind('realTimeVote', function (data) {
                dataPoints.forEach((point) => {
                    if (point.label == data.os) {
                        point.y += data.points;
                        totalVotes += data.points;
                        event = new CustomEvent('votesAdded', { detail: { totalVotes: totalVotes } });
                        // Dispatch the event.
                        document.dispatchEvent(event);
                    }
                });
                chart.render();
            });
        }

    });





