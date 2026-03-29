import {postKeres} from './kozosFetch.js';
import { marker } from './edzoteremValasztoMap.js';

document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('submit').addEventListener('click', async function(e){
        e.preventDefault();
        let formData = new FormData(document.getElementById('edzoSurveyForm'));
        formData.append('edzoterem', {
            lat: marker.position.lat,
            lng: marker.position.lng
        });
        const result = await postKeres('/api/edzoData');
        if(result.message == "adatok sikeresen mentve"){
            window.location.href = '..';
        }
    });
});

