import { fetchBackendData } from "./SVG/backend/data.js";

// Get a reference to the SVG container element
var svgContainer = SVG().addTo("#svg-container");

// Set the size of the SVG container
svgContainer.size(1000, 500);
var nodes;
var cursor = null;
var cursorText = null;

// ------------------------------------------------------
// Linked List from backend
// ------------------------------------------------------
let backendData = fetchBackendData();

// Add the node, later we can read a json file and parse
var parseLinkedList = (linkedList, currNode) => {
  let nodesList = [];
  for (var i = 0; i < linkedList.length; i++) {
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
nodes = parseLinkedList(backendData.nodes, backendData.currNode);

// Create a group to hold the nodes
var nodeGroup = svgContainer.group();

/**
 * ------------------------------------------------------
 * SVG functionality
 * ------------------------------------------------------
 */
// Create a linked list node
let createNode = (nodes) => {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var color = node.cursorPoints ? "green" : "black";
    var circle = nodeGroup
      .circle(50)
      .move(node.x, node.y)
      .fill("white")
      .stroke({ color, width: 4 });
    // Add a text element to the rectangle
    var text = nodeGroup.text(node.value).move(node.x + 15, node.y + 15);
  }
};

// Add linked list arrows
let createNodeArrow = (nodes) => {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (i < nodes.length - 1) {
      var nextNode = nodes[i + 1];
      var line = nodeGroup
        .line(node.x + 55, node.y + 25, nextNode.x - 5, nextNode.y + 25)
        .stroke({ color: "black", width: 4 });

      var arrowhead = svgContainer.marker(5, 3.5, function (add) {
        add.polygon("0 0, 3 1.75, 0 3.5").fill("black");
      });
      line.marker("end", arrowhead);
    }
  }
};

// Add cursor to node
let createCursor = (nodes) => {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (node.cursorPoints) {
      var arrowheadPath = "M0 0 L-10 20 L10 20 Z";
      if (cursor != null) {
        // Create the simulation effect
        cursor.animate(1000, '-').move(node.x + 15, node.y - 40);
      }
      cursor = svgContainer
        .path(arrowheadPath).stroke({ width: 2, color: "black" })
        .move(node.x + 15, node.y - 40)
        .rotate(180)
        .fill("white")
        .stroke({ color: "black", width: 4 });

      cursorText = svgContainer.text("curr").
        fill("black").
        move(node.x + 22, node.y + 60).
        font({ size: 20, anchor: "middle", weight: "bold"});
    }
  }
};

let render = () => {
  createNode(nodes);
  createNodeArrow(nodes);
}

// Now we want to simulate
let checkNextElement = async () => {
  // Remove cursor, cursorText
  animateCursor(cursor);
  animateText(cursorText);
  // console.log(cursor);
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (node.cursorPoints) {
      if (i < nodes.length - 1) {
        node.cursorPoints = false;
        nodes[i + 1].cursorPoints = true;
      }
      break;
    }
  }
  render();
  // console.log(nodes);
};

async function animateCursor(element) {
  element.animate(500).dmove(0, 20).after(function() {
    element.animate(500).dmove(-100, -20).after(animateCursor);
  });
}

async function animateText(element) {
  element.animate(500).dmove(0, 20).after(function() {
    element.animate(500).dmove(100, -20).after(animateCursor);
  });
}


render();
createCursor(nodes);


// ------------------------------------------------------
// Link button with click event
// ------------------------------------------------------
let linkButton = document.getElementById("next-element");
linkButton.addEventListener("click", async () => {
  checkNextElement();
  render();
});
