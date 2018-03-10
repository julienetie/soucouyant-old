
```
Alpha: Not ready for production.
```


.. image:: https://raw.githubusercontent.com/julienetie/img/master/400.jpg 
==========
SOUCOUYANT
==========

Persistent State For Humans
`````````````
.. code:: javascript
    
    // A counter in 4 lines.
    o`cat1 > cat2 > counter ${0}`;                                                // Register stateObject
    
    const varyCounter = amount => o.cat1.cat2.counter (state => state + amount);  // Modify state
    
    varyCounter(1);                                                               // Increment  by 1
    
    varyCounter(-1);                                                              // Decrement  by 1
    
| 
| **stateObject** is represented as a function.
| Register an address (optional categories) and a **stateType** (A constraint on values)
|

    "State: The particular condition that someone or something is in at a specific time."

Soucouyant differentiates between collections and state. A collection is an accumilation of items that are modeled by a stateObject.

.. code:: javascript
    
    // An example of a collection. 
    const todoModel = o({
      text: String
      isComplete: NaN
    }); // Id is not required.

    o`todoMVC > todoList : Object ${todoModel}`; // Register todoModel

    const todosColl = c(Array,todoModel, todoDefaults); // Creates a collection

    todosColl.push()
    todosColl.index(0)                  // Gets stateObject by Index
    todosColl.id(3)                     // Gets stateObject by id 
    todosColl.index(2).id               // Unique Id
    todosColl.id(7).index               // gets index 
    todosColl.offset(value)
    todosColl.index(2).remove()
    todosCall.removeAll()
    todosCall.cycle(-1)                   // Shift all forwards or backwards and preserve
    todosCall.cycle(-1,true)              // Will destroy the last pushed out leaving the beginning empty
    

   

MIT 2018 © Julien Etienne
