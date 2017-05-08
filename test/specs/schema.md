### Complex Scheme of use cases

@sqbox({ name: 'libs' })
file: libs
	- requires lib-a
	- requires lib-b

----
result: ['lib-a', 'lib-b']
----

@sqbox({ name: 'common' })
file: common-a
	- requires common-b

@sqbox({ name: 'common' })
file: common-b
	- requires lib-a

@sqbox({ name: 'common' })
file: common-c
	- no requires

----
result: ['common-a', 'common-b', 'common-c', (a) => 'libs']
----

@sqbox({ name: 'module-b', boxed: ['common'] })
file: source-b - doesn't need common-b
	- requires lib-b
	- requires common-a

----
result: ['source-b', 'common-a', (a) => 'libs']
----

@sqbox({ name: 'module-a' })
file: source-a-1 - doesn't need common-c
	- requires lib-a
	- requires common-a
	- requires common-b

@sqbox({ name: 'module-a', boxed: ['common'] })
file: source-a-2 -> doesn't need common-a, common-b
	- requires lib-b
	- requires common-c
	- requires source-a-1

----
result: ['source-a-1', 'source-a-2', 'common-a', 'common-b', 'common-c', (a) => 'libs']
----
