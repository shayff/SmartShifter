import React, {Component} from 'react';
import {StyleSheet, Text,Button, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';



export default class daySquare extends Component {

    constructor(inside){
        super(inside);
        this.state = {
            DayName : this.props.dayName,
            colorPrefer : [0,0,0],
        }
                                    
      }

      updateSelected = (data)=>
      {
        if(this.props.whichShiftToShowe[data.typeOfShift]) // if the shift is not null
        {
            if(this.props.typeOfAvailabilityColor == 2) // if is prefer
            {
                if(this.state.colorPrefer[0] != 2 && this.state.colorPrefer[1] != 2 && this.state.colorPrefer[2] != 2) // if there is no 'prefer' shift so can color change
                  {
                    this.updateColor({typeOfShift: data.typeOfShift});
                  }
            }
            else
            {
                this.updateColor({typeOfShift: data.typeOfShift});
            }
    
            this.props.clickSelectPreferce({typeOfShift : data.typeOfShift, dateName: this.props.dateName})
        }

      }

      updateColor = (data) =>
      {
        let temp = this.state.colorPrefer;
        temp[data.typeOfShift] = this.props.typeOfAvailabilityColor;
        this.setState({colorPrefer:temp});
      }

    render() {  
return (
    <View>
        <View style={Styles.AreaZone}>
            <Text style={Styles.Text}>{this.state.DayName}: {this.props.dateName}</Text>

            <View style={ this.state.colorPrefer[0] == 2 ? (Styles.PreferButton) : (this.state.colorPrefer[0] == 1 ? Styles.AvailableButton : Styles.NotAvailableButton) }>
                {this.props.whichShiftToShowe[0] ? (
                    <Button title= "morning" onPress={() => this.updateSelected({typeOfShift: 0})} />
                   ): <Button title= "" onPress={() => this.updateSelected({typeOfShift: 0})} />}
                
            </View>

            <View style={ this.state.colorPrefer[1] == 2 ? (Styles.PreferButton) : (this.state.colorPrefer[1] == 1 ? Styles.AvailableButton : Styles.NotAvailableButton) }>
                {this.props.whichShiftToShowe[1] ? (
                    <Button title= "noon" onPress={() => this.updateSelected({typeOfShift: 1})} />
                   ):  <Button title= "" onPress={() => this.updateSelected({typeOfShift: 1})} />}
                
            </View>

            <View style={ this.state.colorPrefer[2] == 2 ? (Styles.PreferButton) : (this.state.colorPrefer[2] == 1 ? Styles.AvailableButton : Styles.NotAvailableButton) }>
                {this.props.whichShiftToShowe[2] ? (
                    <Button title= "evening" onPress={() => this.updateSelected({typeOfShift: 2})} />
                   ):  <Button title= "" onPress={() => this.updateSelected({typeOfShift: 2})} />}
                
            </View>

        </View>
    </View>
);

}
}

const Styles = StyleSheet.create({

Text: {
    alignSelf:'center',
    color: '#ffff'
},
NotAvailableButton : {
    borderColor: '#9c2921',
    borderWidth: 4,
    borderRadius: 10,

},
AvailableButton : {
    borderColor: '#45adba',
    borderWidth: 4,
    borderRadius: 10,

},
PreferButton : {
    borderColor: '#522b8a',
    borderWidth: 4,
    borderRadius: 10,

},
AreaZone: {
    width: 160,
    height: 170,
    backgroundColor: '#638cb0',
    borderRadius: 10,
}

})