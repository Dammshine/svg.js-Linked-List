let backendData = {
  nodes: [10, 20, 30, 40, 50, 60],
  currNode: 10,
};

export function fetchBackendData() {
  return backendData;
}

export function parseLinkedList(linkedList, currNode) {
  let nodesList = [];
  for (let i = 0; i < linkedList.length; i++) {
    let node = {
      x: nodesList.length > 0 ? nodesList[nodesList.length - 1].x + 100 : 50,
      y: 50,
      value: linkedList[i],
      cursorPoints: linkedList[i] === currNode
    };
    nodesList.push(node);
  }
  return nodesList;
};