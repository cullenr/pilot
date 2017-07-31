(function(){
    function listInputsAndOutputs( midiAccess ) {
        for (var entry of midiAccess.inputs) {
            var input = entry[1];
            console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
                    "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
                    "' version:'" + input.version + "'" );
        }

        for (var entry of midiAccess.outputs) {
            var output = entry[1];
            console.log( "Output port [type:'" + output.type + "'] id:'" + output.id +
                    "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
                    "' version:'" + output.version + "'" );
        }
    }

    function onMIDIMessage( event ) {
        var str = "MIDI message received at timestamp " + event.timestamp + "[" + event.data.length + " bytes]: ";
        for (var i=0; i<event.data.length; i++) {
            str += "0x" + event.data[i].toString(16) + " ";
        }
        console.log( str );
    }

    function startLoggingMIDIInput( midiAccess, indexOfPort ) {
        midiAccess.inputs.forEach( function(entry) {entry.onmidimessage = onMIDIMessage;});
    }

    function onMIDISuccess( midiAccess ) {
        console.log( "MIDI ready!" );
        listInputsAndOutputs( midiAccess );
        startLoggingMIDIInput( midiAccess, 1);
    }

    function onMIDIFailure(msg) {
        console.log( "Failed to get MIDI access - " + msg );
    }

    navigator.requestMIDIAccess().then( onMIDISuccess, onMIDIFailure );
})();
