from copy import copy
import numpy as np
import pandas as pd
from operator import itemgetter
import datetime

class ShiftBuilderLogic:
    def __init__(self, matrix, rank_matrix, amount_of_worker_in_shift, shift_start_by_day):
        self.matrix = matrix
        self.rank_matrix = rank_matrix
        self.amount_of_worker_in_shift = amount_of_worker_in_shift
        self.shift_start_by_day = shift_start_by_day
        self.list_possible_matrix = []

    def travel_matrix(self, matrix, x, y):
        if (y == matrix.shape[0]):
            self.list_possible_matrix.append(matrix)
            return

        if matrix[y, x] == 1:
            copy_of_matrix = np.copy(matrix)
            copy_of_matrix[y, x] = 0
            self.travel_matrix(copy_of_matrix, x, y)
            if not self.validate_matrix(matrix, x, y):
                return

        if (x < matrix.shape[1] - 1):
            x += 1
        else:
            y += 1
            x = 0
        self.travel_matrix(matrix, x, y)
        return

    def create_list_matrix_and_count_shift(self):
        list_matrix_shift_count = []
        for matrix in self.list_possible_matrix:
            list_matrix_shift_count.append((np.sum(matrix), matrix))
        return list_matrix_shift_count

    def get_list_of_max_matrix(self, tupple_count_matrix):
        list_matrix_with_max_count = []
        # find the maximum count in a matrix list
        count_max = max(tupple_count_matrix, key=itemgetter(0))[0]
        for tupple in tupple_count_matrix:
            if (tupple[0] == count_max):
                list_matrix_with_max_count.append(tupple[1])
        return list_matrix_with_max_count

    def get_max_rank_matrix(self, list_of_matrix):
        return max(list_of_matrix, key=lambda m: np.sum(np.multiply(m, self.rank_matrix)))

    def validate_matrix(self, matrix, x, y):
        if (matrix[y, x] == 0):
            print("warning")

        workers_in_x_shift = matrix[:, x][:y]  # get the x'th column, until y'th worker (not included)
        if (sum(workers_in_x_shift) > self.amount_of_worker_in_shift[
            x] - 1):  # include the x,y one #to add amount of change the zero to the amount-1
            return False

        begin_of_day_by_shift = self.shift_start_by_day[x]
        shift_in_one_day_by_worker = matrix[y, begin_of_day_by_shift:x]
        if (sum(shift_in_one_day_by_worker) > 0):
            return False;
        return True

    ###For test only###
    '''
    def print_list_as_matrix(self, test_list):
        for exp in test_list:
            self.print_matrix(exp)

    def print_matrix(self, matrix):
        df = pd.DataFrame(matrix, columns=cols, index=rows)
        print(df)
        print("########")
    '''

    def create_cols_and_rows(self):
        rows = []
        cols = []

        for i in range(self.matrix.shape[0] + 1):
            cols.append("shift" + str(i))

        # for j in range(matrix.shape[1]+1):
        #    rows.append("shift"+str(j))
        rows = ["worker1", "worker2"]  # , "worker3", "worker4", "worker5","worker6"]
        return rows, cols

    ###End Of Test ONLY###

    def BuildShift(self):
        start = datetime.datetime.now()

        #rows, cols = self.create_cols_and_rows()

        # create all the possible matrix
        self.travel_matrix(self.matrix, 0, 0)

        print(len(self.list_possible_matrix))

        # count for each matrix how many worker shifted in
        tupple_count_matrix = self.create_list_matrix_and_count_shift()

        print(tupple_count_matrix)

        # get list of matrix with higest number of worker shifted
        result = self.get_list_of_max_matrix(tupple_count_matrix)

        # self.print_list_as_matrix(result)

        max_rank_martrix = self.get_max_rank_matrix(result)
        print(max_rank_martrix)
        # print time calculated
        end = datetime.datetime.now()
        elapsed = end - start
        print(elapsed.seconds, ":", elapsed.microseconds)

'''
# example = np.array([[0,0,1,1,0,0],[0,1,0,1,1,0],[0,0,0,1,0,1],[0,1,0,1,0,1],[1,1,0,1,0,0],[0,0,1,0,0,0]])
example = np.array([[1, 1, 1], [1, 0, 1]])
rank_matrix = np.array([[3, 3, 5], [1, 2, 8]])

amount_of_worker_in_shift = [1, 1, 1]
shift_start_by_day = [0, 0, 2]

classtest = ShiftBuilderLogic(example, rank_matrix, amount_of_worker_in_shift, shift_start_by_day)
classtest.BuildShift()


'''