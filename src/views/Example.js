import React, {useState} from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 400px;
    margin: 8px;
`;

const Controls = styled.div`
    width: 100%;
`;

const Button = styled.button`
    width: auto;
`;

const UnorderedList = styled.ul`
    margin: 10px 0 0 0;
`;

const TrackListTitle = styled.span`
    cursor: pointer;
`;

const DeleteTrack = styled.div`
    cursor: pointer;
`;

const Example = () => {
    const [playlist, setPlaylist] = useState([]);
    const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
    const [currentAudioId, setCurrentAudioId] = useState(0);

    const audioPlayer = document.getElementById("audio_player");

    const TrackListItem = styled.li`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: ${currentAudioIndex === true ? "green" : "red"};
    `;

    const handleOnInput = (event) => {
        const reader = new FileReader();
        const audioNameString = event.target.files[0].name;

        reader.onload = function (event) {
            const audioReference = event.target.result;
            
            addToPlaylist(audioNameString, audioReference)
        };

        reader.readAsDataURL(document.getElementById("audio_file_input").files[0]);
    }

    const handlePlay = (index) => {
        if (!currentAudioIndex && playlist[0]) {
            audioPlayer.src = playlist[0].target;
            setCurrentAudioIndex(1);
        }
        if (audioPlayer) {
            if (typeof index === 'number' && index !== currentAudioIndex) {
                setCurrentAudioIndex(index);
                audioPlayer.src = playlist[index - 1].target;
                audioPlayer.play();
                audioPlayer.volume = "0.02";
                console.log(`currentAudioIndex ${currentAudioIndex}`);
                console.log(`index ${index}`);
                
            } else {
            if (audioPlayer.paused) {
                audioPlayer.play();
                audioPlayer.volume = "0.02";
                
            } else {
                audioPlayer.pause();
            }
        }
        } else {
            window.alert("No Track Selected")
        }

    }

    const nextTrack = () => {
        if (playlist.length > 1) {
            audioPlayer.pause();
            if (currentAudioIndex + 1 > playlist.length ) {
                setCurrentAudioIndex(1)
                audioPlayer.src = playlist[0].target;

            } else {
                setCurrentAudioIndex(currentAudioIndex + 1)
                audioPlayer.src = playlist[currentAudioIndex].target;
            }
            handlePlay();

        } else {
            window.alert("Playlist too small!")
        }
    }

    const prevTrack = () => {
        if (playlist.length > 1) {
            audioPlayer.pause();
            console.log(`currentAudioIndex = ${currentAudioIndex}`)
            if (currentAudioIndex - 1 < 0 ) {
                setCurrentAudioIndex(playlist.length)
                audioPlayer.src = playlist[playlist.length - 1].target;

            } else {
                setCurrentAudioIndex(currentAudioIndex - 1)
                audioPlayer.src = playlist[currentAudioIndex].target;
            }
            handlePlay();

        } else {
            window.alert("Playlist too small!")
        }
    }

    const addToPlaylist = (audioName, audioReference) => {
        setPlaylist(playlist.concat([{id: currentAudioId, name: audioName, target: audioReference}]))
        setCurrentAudioId(currentAudioId + 1)
    }

    const removeFromPlaylist = (index) => {
        if (playlist.length > 0) {
            const playlistClone = playlist.filter(item => item.id !== index);
            
            setPlaylist(playlistClone)
            console.log("removeFromPlaylist has been called")
            console.log(`playlist.filter(item => item.id !== index - 1) ${playlist.filter(item => item.id !== index - 1)}`)
        }
    }

    const handleOnEnded = () => {
        nextTrack();
    }
    const mapPlaylist = () => {
        if (playlist.length > 0) {
            return playlist.map((playlist, index) =>
                <TrackListItem style={{
                    color: currentAudioIndex === index + 1 ? "green" : "red"
                }} key={index + Math.random()}>
                    <TrackListTitle onClick={() => handlePlay(index + 1)}>
                        {playlist.name}
                    </TrackListTitle>
                    <DeleteTrack onClick={() => removeFromPlaylist(playlist.id)}>X</DeleteTrack>
                </TrackListItem>
            );
        } else {
            return "Empty"
        };
    }

    return (
        <Container>
            <audio id='audio_player' onEnded={handleOnEnded} controls/>
            <input id='audio_file_input' type="file" accept='audio/*' onInput={handleOnInput} />
            <Controls>
                <Button onClick={handlePlay}>Play / Pause</Button>
                <Button onClick={prevTrack}>&lt;&lt;</Button>
                <Button onClick={nextTrack}>&gt;&gt;</Button>
            </Controls>
            <UnorderedList>
                <li>Playlist Length: {playlist.length}</li>
                <li>Current Audio Index: {currentAudioIndex}</li>
                <li>
                    <UnorderedList>Playlist: {mapPlaylist()}</UnorderedList>
                </li>
            </UnorderedList>
        </Container>
    );
};

export default Example;