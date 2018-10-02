
```
Alpha: Prototype, not ready for production.
```


.. image:: https://raw.githubusercontent.com/julienetie/img/master/400.jpg 
==========
SOUCOUYANT
==========

Clean - Functional - Persistent State For Humans
`````````````

A counter in Soucouyant
------------------
.. code:: javascript

    o`cat1 > cat2 > counter ${0}`;                                               // Register stateObject
    
    const varyCounter = amount => o.cat1.cat2.counter(state => state + amount);  // Modify state
    
    varyCounter(1);                                                              // Increment  by 1
    
    varyCounter(-1);                                                             // Decrement  by 1
    
vs Redux example
------------------
.. code::     
    
    const counter = (state = 0, action) => {
    switch (action.type) {
      case 'INCREMENT':
       state++;
        break;
      case 'DECREMENT':
        state--;
        break;
    }
    return state;
  }

    const store = Redux.createStore(counter);

    store.dispatch({type: 'DECREMENT'});

    store.dispatch({type: 'INCREMENT'});
    
    
Use Soucouyant
-------------------
.. code:: javascript

    import { o, Collection } from 'soucouyant';
    

Create and update a collection
-------------------
.. code:: javascript

    const randpmPos = () => ~~(Math.random() * 200);             // Random position
    const randomMovement = () => !!Math.round(Math.random());    // Random movement

    Collection([...Array(64)])                                  // Create collection
    `effect > random > particlesColl`;

    const particlesColl = o.effect.random.particlesColl;         // Reference path
    
    const particlesEntries = particlesColl.entries.map((_,i) => ([i,{   // and modify.
         isVibrating: randomMovement(),
         xPosition: randpmPos(),
         yPosition: randpmPos(),
         zPosition: randpmPos()
    }]));

    particlesColl.update(particlesEntries);      // Update the collection.

Features
------------------
   - Register stateObjects to property paths on the fly.
   - Register Collections to property paths on the fly.
   - Collection entries feature identities.
   - Expose entries and update Collections to modify natively before updating. 
   - Persistent time machine - TBA.
   - Time travel a state, collection or an entire frame - TBA.
   - Persistent options - TBA.
   - Currently 1kb should not exceed 8kb.
   
   
   
stateObject API
################

.stateObject(<callback>) :: Set state
``````````

.. code:: javascript

    o.button(state => state + 100);
    
    // or
    
    o.button(function(state){
       return state + 100;
    });

Set the new state of a stateObject. State is set by returning the new value, you are also able to access the last state.

  - **<callback>** - Function | required | Callback for state object.
  
*callback (<state>)*

  - **<state>** - * | required | The last state.
  


.stateObject(<callback>) :: Get state
``````````

.. code:: javascript

    o.button(state => void showSideBar(state));
    
    // or
    
    o.button(function(state){
        showSideBar(state);
    });

Get the last state of a stateObject. Because state is set by the return value, if you are checking the state without changing state, undefined must be returned. void ensures undefined is returned when using state inline. 

  - **<callback>** - Function | required | Callback for state object.
  
*callback (<state>)*

  - **<state>** - * | required | The last state.


.subscribe(<ref>,<callback>)
``````````

.. code:: javascript

    o.button.subscribe('show-menu', (state, identity, timeStamp) => {
       //
    });

Subscribe triggers a callback onStateChange of a stateObject.

  - **<ref>** - string | required | A unique subscription reference.
  - **<callback>** - Function | required | Callback to trigger onStateChange.

*callback (<state>, <identity>, <timeStamp>)*

  - **<state>** - * | The new state.
  - **<identity>** - number | The internal identity of the stateObject.
  - **<timeStamp>** - number | The timeStamp of the new state change.


.suspend(<ref>)
``````````
.. code:: javascript

    o.button.suspend('show-menu');

Suspend allows you to temporarily ignore state changes for a specific subscription by providing the subscription's reference. To reverse a suspended subscription use unsubscribe. 

  - **<ref>** - string | required
  

.unsubscribe(<ref>)
``````````
.. code:: javascript

    o.button.unsubscribe('show-menu');

Unsubscribe removes all registered subscription callbacks for a given subscription reference. 

  - **<ref>** - string | required

State values
``````````

State supports the following types: 
  - String
  - Number
  - Boolean
  - null 
  - NaN
  - Array (Without nested functions)
  - Object literals (without nested functions)

A state cannot be nor contain:
  - Function
  - Complex object 
  - Built-in object
  - Circular references 
  - undefined

MIT 2018 © Julien Etienne
