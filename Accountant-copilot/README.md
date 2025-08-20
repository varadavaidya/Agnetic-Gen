  It's a self accountant. This system has three entities. One, a local LLM OLLAMA model llama3. 
Two, an API app in Node.js which takes API requests. Three, replicas of MongoDB pods in stateful
condition and common data.
In this, because all of them are in same common network, one can access one pod from another. 
The ClusterIP also acts as a load balancer. and distributes the requests across MongoDB pods 
to GET either the expense reports or POST the recent spending.
In all this, OLLAMA is brilliant at figuring out what is the category of spending 
and how much is spend and returns a JSON response to be saved in MongoDBs.
The common volumes and stateful implementation of Deployments of MongoDBs 
will help them have common data so that queries can be distributed without async data.

HOW TO RUN?

DO >>> kubectl apply -f <path_to_the_filename> 
