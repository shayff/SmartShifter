import React, {Component} from 'react';
import {StyleSheet, Text,Button, View } from 'react-native';


export default class 

daySquare extends Component {

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
                <Text style={Styles.Text}>{this.state.DayName}: {this.props.dateName}</Text>
                <View style={Styles.line}>
                    <View style={ this.state.colorPrefer[0] == 2 ? (Styles.PreferButton) : (this.state.colorPrefer[0] == 1 ? Styles.AvailableButton :(this.props.whichShiftToShowe[0]? Styles.NotAvailableButton:Styles.nullButton)) }>
                        {this.props.whichShiftToShowe[0] ? (
                            <Button title= "morning" onPress={() => this.updateSelected({typeOfShift: 0})} />
                        ): null}
                        
                    </View>
                
                    <View style={ this.state.colorPrefer[1] == 2 ? (Styles.PreferButton) : (this.state.colorPrefer[1] == 1 ? Styles.AvailableButton : (this.props.whichShiftToShowe[1] ? Styles.NotAvailableButton:Styles.nullButton)) }>
                        {this.props.whichShiftToShowe[1] ? (
                            <Button title= "noon" onPress={() => this.updateSelected({typeOfShift: 1})} />
                        ):  null}
                        
                    </View>

                    <View style={ this.state.colorPrefer[2] == 2 ? (Styles.PreferButton) : (this.state.colorPrefer[2] == 1 ? Styles.AvailableButton :(this.props.whichShiftToShowe[2] ? Styles.NotAvailableButton: Styles.nullButton)) }>
                        {this.props.whichShiftToShowe[2] ? (
                            <Button title= "evening" onPress={() => this.updateSelected({typeOfShift: 2})} />
                        ):  null}
                        
                    </View>
                </View>
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    Text:
    {
        fontWeight: 'bold',
        fontSize:16,
        color:'#ffff',
        alignSelf:'center',
    },
    line:
    {
        padding:2,
        flexDirection : 'row',
    },
    NotAvailableButton : {
        borderColor: '#b22222',
        borderWidth: 4,
        borderRadius: 2,
        width:130,
        padding:0,
    },
    AvailableButton : {
        borderColor: '#3cb371',
        borderWidth: 4,
        borderRadius: 2,
        width:130,

    },
    PreferButton : {
        borderColor: '#9370db',
        borderWidth: 4,
        borderRadius: 2,
        width:130,
    },
    nullButton:{
        borderColor: '#36485f',
        borderWidth: 3,
        borderRadius: 2,
        width:130,

    }
});