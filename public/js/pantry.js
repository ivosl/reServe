$(document).ready(function() {
  // Our inventory will go inside the inventoryContainer
  var $inventoryContainer = $(".inventory-container");

  // Adding event listeners for deleting, editing, and adding inventory
  $(document).on("click", "button.type", toggleCustomerType);

  // Our initial inventory array
  var inventory = [];

  // Getting inventory from database when page loads
  getInventory();

  // This function resets the inventory displayed with new inventory from the database
  function initializeRows() {
    $inventoryContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < inventory.length; i++) {
      rowsToAdd.push(createNewRow(inventory[i]));
    }
    $inventoryContainer.prepend(rowsToAdd);
  }

  // This function grabs inventory from the database and updates the view
  function getInventory() {
    $.get("/api/inventory", function(data) {
      inventory = data;
      initializeRows();
    });
  }

  // Toggles complete status
  function toggleCustomerType(event) {
    event.stopPropagation();
    var inventory = $(this).parent().data("inventory");
    inventory.grocery = !inventory.grocery;
    updateTodo(inventory);
  }

  // This function updates inventory in our database
  function updateInventory(inventory) {
    $.ajax({
      method: "PUT",
      url: "/api/inventory",
      data: inventory
    }).then(getInventory);
  }

  // This function constructs a inventory-item row
  function createNewRow(inventory) {
    var $newInputRow = $(
      [
        "<li class='list-group-item inventory-item'>",
        "<span>",
        inventory.text,
        "</span>",
        "<input type='text' class='edit' style='display: none;'>",
        "<button class='delete btn btn-default'>x</button>",
        "<button class='complete btn btn-default'>✓</button>",
        "</li>"
      ].join("")
    );

    $newInputRow.find("button.delete").data("id", inventory.id);
    $newInputRow.find("input.edit").css("display", "none");
    $newInputRow.data("inventory", inventory);
    if (inventory.grocery) {
      $newInputRow.find("span").css("text-decoration", "line-through");
    }
    return $newInputRow;
  }

});
