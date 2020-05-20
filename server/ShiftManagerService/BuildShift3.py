import numpy as np

class Hungarian:
    def __init__(self,input_matrix):
        self.input_matrix=input_matrix
        self.column_size = input_matrix.shape[1]
        self.row_size = input_matrix.shape[0]
        self.matrix_size = max(self.column_size, self.row_size)

    def run(self):
        #Step 1: subsract the minimum element from each row
        min_elem_in_row = np.amin(self.input_matrix, axis=1)
        self.input_matrix -= np.vstack(min_elem_in_row)

        #Step 2: subsract the minimum element from each column
        min_elem_in_col = np.amin(self.input_matrix, axis=0)
        self.input_matrix -= min_elem_in_col

        #Step 3: Cover all zero's with minimum number of lines
        #If the number of lines not equal to the
        number_of_lines = 0
        while number_of_lines < self.matrix_size:
            number_of_lines+=1
        print(self.input_matrix)

    class CoverZeros:
        def __init__(self, input_matrix):
            self.input_matrix = input_matrix
            self.zero_matrix = input_matrix == 0
            self._marked_rows = []
            self._marked_columns = []


example = np.array([ [0,83,69,92],[77,37,49,92],[11,69,5,86],[8,9,98,23] ])
#example = np.array([ [82,83,69,92],[77,37,49,92],[11,69,5,86],[8,9,98,23] ])
print(example == 0)
'''
print(example)
test_class = Hungarian(example)
test_class.run()
'''