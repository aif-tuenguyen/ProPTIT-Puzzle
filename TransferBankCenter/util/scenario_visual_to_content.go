package util

import (
	"encoding/json"
	"fmt"
	"github.com/vanhocvp/junctionx-hackathon/transfer-demo/setting"
	"log"
)

// ExtractPortList ...
func extractPortList(cell map[string]interface{}) ([]string, error) {
	ports, ok := cell["ports"].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("extractPortList | Error when asserting port")
	}
	portsItems, ok := ports["items"].([]interface{})
	if !ok {
		return nil, fmt.Errorf("extractPortList | Error when asserting portsItems")
	}
	portList := make([]string, 0)
	for _, port := range portsItems {
		port, ok := port.(map[string]interface{})
		if !ok {
			return nil, fmt.Errorf("extractPortList | Error when asserting port")
		}
		id, ok := port["id"].(string)
		if !ok {
			return nil, fmt.Errorf("extractPortList | Error when asserting id")
		}
		portList = append(portList, id)
	}
	return portList, nil
}

// GetSourceTransitionID ...
func getSourceTransitionID(linkCell map[string]interface{}) (string, error) {
	sourceData, ok := linkCell["source"].(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("GetSourceTransitionID | Error when asserting sourceData")
	}
	sourceID := sourceData["id"].(string)
	if !ok {
		return "", fmt.Errorf("GetSourceTransitionID | Error when asserting sourceID")
	}
	return sourceID, nil
}

// GetTargetTransitionID ...
func getTargetTransitionID(linkCell map[string]interface{}) (string, error) {
	targetData, ok := linkCell["target"].(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("GetTargetTransitionID | Error when asserting targetData")
	}
	targetID := targetData["id"].(string)
	if !ok {
		return "", fmt.Errorf("GetTargetTransitionID | Error when asserting targetID")
	}
	return targetID, nil
}

// Convert ...
func pushTransition(source map[string]interface{}, target map[string]interface{}, link map[string]interface{}) error {
	transitionList, ok := source["transitions"].([]interface{})
	if !ok {
		return fmt.Errorf("convert | Error when asserting transitionList")
	}
	transition := make(map[string]interface{})
	defaultPort := []string{
		"START",
		"no_input",
		"no_matches_condition",
		"IN",
		"END",
		"end",
		"chat",
		"action",
		"forward",
		"fail",
		"success",
	}
	transition["next"], ok = target["name"].(string)
	if !ok {
		return fmt.Errorf("convert | Error when asserting transition['next']")
	}
	sourceInLink, ok := link["source"].(map[string]interface{})
	if !ok {
		return fmt.Errorf("convert | Error when asserting sourceInLink")
	}
	sourcePortID, ok := sourceInLink["port"].(string)
	if !ok {
		return fmt.Errorf("convert | Error when asserting sourcePortID")
	}
	isIn := false
	for _, port := range defaultPort {
		if sourcePortID == port {
			isIn = true
			break
		}
	}
	if isIn {
		transition["event"] = sourcePortID
		transition["condition"] = map[string]interface{}{}
	} else {
		transition["event"] = "match"
		propertiesJSON, err := json.Marshal(source["properties"])
		if err != nil {
			return err
		}
		fmt.Printf("[info] properties: %s", string(propertiesJSON))
		sourceProperties, ok := source["properties"].(map[string]interface{})
		if !ok {
			return fmt.Errorf("convert | Error when asserting sourceProperties")
		}
		portsData, ok := sourceProperties["ports"].([]interface{})
		if !ok {
			return fmt.Errorf("convert | Error when asserting portsData")
		}
		// transition["condition"] = portsData[sourcePortID]
		for _, portInf := range portsData {
			portData, ok := portInf.(map[string]interface{})
			if !ok {
				return fmt.Errorf("convert | Error when asserting portData")
			}
			if portData["port_id"] == sourcePortID {
				transition["condition"] = portData
			}
		}
	}
	transitionJSON, err := json.Marshal(transitionList)
	if err != nil {
		return err
	}

	// targetPortID := link["target"].(map[string]interface{})["port"].(string)
	// if targetPortID == "IN" || targetPortID == "END" {
	// 	transition := map[string]interface{}{
	// 		"input_id": source["name"],
	// 	}
	// 	target["transitions"] = append(target["transitions"].([]interface{}), transition)
	// }

	log.Printf("[info] pushTransition | transition: %s", string(transitionJSON))
	transitionList = append(transitionList, transition)
	// fmt.Print(transitionList)
	source["transitions"] = transitionList
	return nil
}

// func getInputSlots(trigger map[string]interface{}) []interface{} {
// 	inputSlots := make([]interface{}, 0)
// 	inputSlots = append(inputSlots, map[string]interface{}{
// 		"key":   "phone",
// 		"value": nil,
// 	})
// 	// default

// 	for _, variable := range trigger["properties"].(map[string]interface{})["variables"].([]interface{}) {
// 		inputSlots = append(inputSlots, variable)
// 	}

// 	return inputSlots
// }

func getStateMap(cells []interface{}) (map[string]interface{}, error) {
	var err error
	statesMap := make(map[string]interface{})

	for _, cellInterface := range cells {
		cell, ok := cellInterface.(map[string]interface{})
		if !ok {
			return nil, fmt.Errorf("GetStateMap | Error when asserting cell")
		}
		typeName := cell["type"].(string)
		contentData := make(map[string]interface{})
		contentData["transitions"] = make([]interface{}, 0)
		if setting.ScenarioElementTypeMapping[typeName] == "" {
			log.Printf("[info] getStateMap | GetTypeName: %v", typeName)
			continue
		}
		contentData["name"], ok = cell["id"].(string)
		if !ok {
			return nil, fmt.Errorf("GetStateMap | Error when asserting contentData['name']")
		}
		contentData["type"] = setting.ScenarioElementTypeMapping[typeName]
		contentData["ports"], err = extractPortList(cell)
		if err != nil {
			return nil, err
		}
		visualDataInf := cell["data"]
		if visualDataInf != nil {
			contentData["properties"], ok = visualDataInf.(map[string]interface{})
			if !ok {
				return nil, fmt.Errorf("GetStateMap | Error when asserting contentData['properties']")
			}
		}
		stateName, ok := contentData["name"].(string)
		if !ok {
			return nil, fmt.Errorf("GetStateMap | Error when asserting stateName")
		}
		statesMap[stateName] = contentData
	}

	return statesMap, nil
}

func VisualToContent(visualData map[string]interface{}) (map[string]interface{}, error) {
	cells, ok := visualData["cells"].([]interface{})
	if !ok {
		return nil, fmt.Errorf("VisualToContent | Error when parsing cells")
	}
	statesMap, err := getStateMap(cells)
	if err != nil {
		return nil, err
	}
	// Loop for transitions
	for _, cellInterface := range cells {
		cell := cellInterface.(map[string]interface{})
		typeName := cell["type"].(string)

		if typeName != "app.Link" {
			continue
		}

		sourceCellID, err := getSourceTransitionID(cell)
		if err != nil {
			log.Printf("[error] VisualToContent | Error: %v", err)
		}
		sourceCell := statesMap[sourceCellID]
		targetCellID, err := getTargetTransitionID(cell)
		if err != nil {
			log.Printf("[error] VisualToContent | Error: %v", err)
		}
		targetCell := statesMap[targetCellID]

		err = pushTransition(sourceCell.(map[string]interface{}), targetCell.(map[string]interface{}), cell)
		if err != nil {
			return nil, err
		}
	}

	for _, item := range statesMap {
		if item.(map[string]interface{})["ports"] == nil {
			continue
		}
		ports := item.(map[string]interface{})["ports"].([]string)
		if item.(map[string]interface{})["transitions"] == nil {
			continue
		}
		transitions := item.(map[string]interface{})["transitions"].([]interface{})
		newTransitions := make([]interface{}, 0)
		for _, portName := range ports {
			for _, transition := range transitions {
				if transition.(map[string]interface{})["event"].(string) == portName {
					newTransitions = append(newTransitions, transition)
				}
				if transition.(map[string]interface{})["event"].(string) == "match" {
					if transition.(map[string]interface{})["condition"].(map[string]interface{})["port_id"].(string) == portName {
						newTransitions = append(newTransitions, transition)
					}
				}
			}
		}
		item.(map[string]interface{})["transitions"] = newTransitions
	}

	return statesMap, nil
}
