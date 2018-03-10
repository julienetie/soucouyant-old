
```
Alpha: Not ready for production.
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
    
Redux example
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
    
Create and update a collection
-------------------
.. code:: javascript

    Collection([...Array(256)])                                  // Create collection
    `effect > random > particlesColl`;

    const randpmPos = () => ~~(Math.random() * 200);             // Random position
    
    const randomMovement = () => !!Math.round(Math.random());    // Random movement

    const particlesColl = o.effect.random.particlesColl;         // Reference path
    
    const particlesEntries = particlesColl.entries.map(_ => ({   // and modify.
         isVibrating: randomMovement(),
         xPosition: randpmPos(),
         yPosition: randpmPos(),
         zPosition: randpmPos()
    });

    o.effect.random.particlesColl.update(particlesEntries);      // Update the collection.

Features
------------------
   - Register stateObjects to property paths on the fly.
   - Register Collections to property paths on the fly.
   - Collection entries feature identities.
   - Expose entries and update Collections to modify natively before updating. 
   - Time travel a state, collection or an entire frame - TBA.
   - Finetune the accumilator - TBA.
   - Currently 1kb should not exceed 8kb.
   

MIT 2018 © Julien Etienne
