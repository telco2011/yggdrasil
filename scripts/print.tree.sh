#!/bin/bash

# $1 => Directory to print the tree.
echo "print tree for directory $1"
tree -L 5 --dirsfirst $1